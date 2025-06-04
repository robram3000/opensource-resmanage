"""
Error Handling Package

Exports:
- auth_errors: Authentication and security errors
- validation_errors: Data validation errors
- rbac_errors: Role-based access control errors
- ApiError: Base exception class
"""

from .auth_errors import AUTH_ERRORS, get_auth_error
from .validation_errors import VALIDATION_ERRORS, format_validation_error
from .rbac_errors import RBAC_ERRORS, get_rbac_error

class ApiError(Exception):
    """Base class for all API exceptions"""
    def __init__(self, error_type, message, code=None, details=None):
        self.error_type = error_type
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)

    def to_dict(self):
        return {
            "error": self.error_type,
            "message": self.message,
            "code": self.code,
            "details": self.details
        }


__all__ = [
    'AUTH_ERRORS',
    'VALIDATION_ERRORS',
    'RBAC_ERRORS',
    'ApiError',
    'get_auth_error',
    'format_validation_error',
    'get_rbac_error',
    'handle_api_errors'
]