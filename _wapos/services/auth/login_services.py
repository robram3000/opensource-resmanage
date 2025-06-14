from datetime import datetime, timedelta
from extension.database_extension import db
from flask import current_app
from jwt import encode, decode, PyJWTError
from model.core.user import User
from model.core.role import Role
from .exception import  InvalidCredentialsError, AccountInactiveError, TokenExpiredError, PermissionDeniedError

class LoginService:
    @staticmethod
    def authenticate_user(email: str, password: str, required_permission: str = None) -> User:
        """
        Authenticate user with email and password with optional permission check.
        
        Args:
            email (str): User's email
            password (str): Plain text password
            required_permission (str, optional): Permission required for this action
            
        Returns:
            User: Authenticated user object
            
        Raises:
            InvalidCredentialsError: If credentials are invalid
            AccountInactiveError: If account is not active
            PermissionDeniedError: If user doesn't have required permission
        """
        user = db.session.query(User).filter_by(email=email).first()
        
        if not user:
            raise InvalidCredentialsError("Invalid email or password")
        
        if not user.check_password(password):
            raise InvalidCredentialsError("Invalid email or password")
        
        if not user.is_active:
            raise AccountInactiveError("Account is deactivated")
            
        if required_permission and not LoginService.has_permission(user, required_permission):
            raise PermissionDeniedError(f"User lacks required permission: {required_permission}")
        
        return user

    @staticmethod
    def generate_session_token(user: User) -> str:
        """Generate JWT token for session management with role and permissions"""
        payload = {
            "sub": str(user.user_id),
            "email": user.email,
            "role": user.role.role_name if user.role else None,
            "permissions": [p.permission_name for p in user.role.permissions] if user.role else [],
            "exp": datetime.utcnow() + timedelta(
                minutes=current_app.config.get('JWT_EXPIRATION_MINUTES', 30)
            )
        }
        return encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm="HS256"
        )

    @staticmethod
    def validate_session_token(token: str) -> dict:
        """Validate and decode JWT token"""
        try:
            return decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=["HS256"]
            )
        except PyJWTError:
            return None

    @staticmethod
    def has_permission(user: User, permission_name: str) -> bool:
        """Check if user has a specific permission"""
        if not user.role:
            return False
            
        return any(
            p.permission_name == permission_name 
            for p in user.role.permissions
        )

    @staticmethod
    def get_user_permissions(user: User) -> list:
        """Get all permissions for a user"""
        if not user.role:
            return []
            
        return [p.permission_name for p in user.role.permissions]