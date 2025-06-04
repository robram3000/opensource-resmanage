# ======================
# AUTHENTICATION ERRORS
# ======================
AUTH_ERRORS = {
    # Login & Credentials
    "INVALID_CREDENTIALS": {
        "code": 401,
        "message": "Invalid username or password.",
        "action": "Please check your credentials and try again."
    },
    "ACCOUNT_LOCKED": {
        "code": 403,
        "message": "Account temporarily locked.",
        "action": "Try again after 30 minutes or reset your password."
    },
    "TOKEN_EXPIRED": {
        "code": 401,
        "message": "Session token has expired.",
        "action": "Please log in again."
    },
    
    # Permissions
    "SUPER_ADMIN_REQUIRED": {
        "code": 403,
        "message": "Super-admin access required.",
        "action": "Contact your system administrator."
    },
    "ROLE_ACCESS_DENIED": {
        "code": 403,
        "message": "Your role does not have permission for this action.",
        "action": "Request higher privileges if needed."
    },
}