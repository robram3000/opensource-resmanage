from datetime import datetime
from extension.database_extension import db
from .order import Order
from .user import User

class Payment(db.Model):
    __tablename__ = 'payments'
    
    payment_id = db.Column(db.Integer, primary_key=True)
    payment_method = db.Column(db.String(50), nullable=False)  # Cash, Card, UPI, etc.
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    transaction_id = db.Column(db.String(100))
    status = db.Column(db.String(20), default='Completed')  # Completed, Failed, Refunded
    payment_time = db.Column(db.DateTime, default=datetime.utcnow)
    processed_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    refund_approver = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    
    # Relationships
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    order = db.relationship('Order', back_populates='payments')
    processor = db.relationship('User', foreign_keys=[processed_by], backref=db.backref('processed_payments', lazy='dynamic'))
    approver = db.relationship('User', foreign_keys=[refund_approver], backref=db.backref('approved_refunds', lazy='dynamic'))

    def __repr__(self):
        return f"<Payment {self.payment_id} {self.payment_method} {self.amount}>"