from datetime import datetime, timedelta
from flask import current_app
from jwt import encode, decode, PyJWTError

class TokenService:
    @staticmethod
    def refresh_token(user_id: str) -> str:
        """Generate a new access token."""
        payload = {
            "sub": user_id,
            "exp": datetime.utcnow() + timedelta(
                minutes=current_app.config['JWT_EXPIRATION_MINUTES']
            )
        }
        return encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm="HS256"
        )

    @staticmethod
    def is_token_revoked(token: str) -> bool:
        """Check if token is blacklisted (Redis/DB lookup)."""
        # Implement with Redis/Database
        return False