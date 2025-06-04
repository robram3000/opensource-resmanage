from .core import (
    User,
    Role,
    Customer,
    MenuCategory,
    MenuItem,
    Ingredient,
    Supplier,
    Order,
    OrderItem,
    Table,
    Reservation,
    Payment
)


from .audit import (
    SystemActivityLog,
    DataChangeLog,
    AuthenticationLog,
    FinancialAuditLog,
    InventoryAdjustmentLog
)


__all__ = [
 
    'User',
    'Role',
    'Customer',
    'MenuCategory',
    'MenuItem',
    'Ingredient',
    'Supplier',
    'Order',
    'OrderItem',
    'Table',
    'Reservation',
    'Payment',
    'SystemActivityLog',
    'DataChangeLog',
    'AuthenticationLog',
    'FinancialAuditLog',
    'InventoryAdjustmentLog'
]


from extension.database_extension import db

def init_app(app):
    """Initialize models with Flask app context"""
    db.init_app(app)