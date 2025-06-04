from datetime import datetime
from extension.database_extension import db

class Order(db.Model):
    __tablename__ = 'orders'
    
    order_id = db.Column(db.Integer, primary_key=True)
    order_type = db.Column(db.String(20), nullable=False)  # Dine-in, Takeaway, Delivery
    status = db.Column(db.String(20), default='Pending')  # Pending, In Progress, Completed, Cancelled
    total_amount = db.Column(db.Numeric(10, 2))
    tax_amount = db.Column(db.Numeric(10, 2))
    discount_amount = db.Column(db.Numeric(10, 2), default=0)
    final_amount = db.Column(db.Numeric(10, 2))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_updated_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    update_reason = db.Column(db.Text)
    
    # Relationships
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    customer = db.relationship('Customer', back_populates='orders')
    table_id = db.Column(db.Integer, db.ForeignKey('tables.table_id'))
    table = db.relationship('Table')
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order')
    payments = db.relationship('Payment', back_populates='order')

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