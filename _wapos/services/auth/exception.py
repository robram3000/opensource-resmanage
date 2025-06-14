class AuthError(Exception):
    """Base authentication error"""
    pass

class InvalidCredentialsError(AuthError):
    """Invalid login credentials"""
    pass

class AccountInactiveError(AuthError):
    """Account is inactive"""
    pass

class TokenExpiredError(AuthError):
    """JWT token has expired"""
    pass

class PermissionDeniedError(AuthError):
    """User lacks required permissions"""
    pass