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

def init_app(app):
    """Initialize models with Flask app context"""
    from extension.database_extension import db
    db.init_app(app)
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()