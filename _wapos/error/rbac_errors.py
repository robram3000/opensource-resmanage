# ======================
# RBAC-SPECIFIC ERRORS
# ======================
RBAC_ERRORS = {
    "HIERARCHY_VIOLATION": {
        "code": 403,
        "message": "You cannot modify a user with higher privileges.",
        "action": "Only super-admins can modify other admins."
    },
    "SELF_DEMOTION_DENIED": {
        "code": 403,
        "message": "You cannot demote yourself.",
        "action": "Contact another admin to change your role."
    },
}