# ======================
# VALIDATION ERRORS
# ======================
VALIDATION_ERRORS = {
    # User Input
    "MISSING_REQUIRED_FIELD": {
        "code": 400,
        "message": "Required field is missing.",
        "field": None,  # Dynamically updated
        "action": "Fill in all required fields."
    },
    "INVALID_EMAIL": {
        "code": 400,
        "message": "Email format is invalid.",
        "action": "Enter a valid email (e.g., user@example.com)."
    },
    
    # Role Validation
    "INVALID_ROLE": {
        "code": 400,
        "message": "Role does not exist.",
        "valid_roles": ["super-admin", "admin", "staff"],  # Example
        "action": "Choose a valid role from the list."
    },
    
    # Security Policies
    "PASSWORD_TOO_WEAK": {
        "code": 400,
        "message": "Password does not meet security requirements.",
        "requirements": "Minimum 8 chars, 1 uppercase, 1 number, 1 symbol.",
        "action": "Strengthen your password and try again."
    },
}