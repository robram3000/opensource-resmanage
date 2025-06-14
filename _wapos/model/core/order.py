from datetime import datetime
from extension.database_extension import db
from .customer import Customer
from .table import Table
from .user import User

class Order(db.Model):
    __tablename__ = 'orders'
    
    order_id = db.Column(db.Integer, primary_key=True)
    order_type = db.Column(db.String(20), nullable=False)  # DINE_IN, TAKEAWAY, DELIVERY
    status = db.Column(db.String(20), default='Pending')  # Pending, Processing, Completed, Cancelled
    total_amount = db.Column(db.Numeric(10, 2))
    tax_amount = db.Column(db.Numeric(10, 2))
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    final_amount = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign Keys
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    table_id = db.Column(db.Integer, db.ForeignKey('tables.table_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))  # Who created the order
    last_updated_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))  # Who last updated the order
    
    update_reason = db.Column(db.Text)
    
    # Relationships
    customer = db.relationship('Customer', back_populates='orders')
    table = db.relationship('Table', back_populates='orders')
    created_by = db.relationship('User', foreign_keys=[user_id], backref=db.backref('created_orders', lazy='dynamic'))
    updated_by = db.relationship('User', foreign_keys=[last_updated_by], backref=db.backref('updated_orders', lazy='dynamic'))
    order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='order', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Order {self.order_id} {self.status}>"

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    order_item_id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    special_instructions = db.Column(db.Text)
    status = db.Column(db.String(20), default='Pending')  # Pending, Cooking, Ready, Served
    
    # Relationships
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    order = db.relationship('Order', back_populates='order_items')
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'))
    item = db.relationship('MenuItem', back_populates='order_items')

    def __repr__(self):
        return f"<OrderItem {self.order_item_id} for order {self.order_id}>"