from datetime import datetime
from extension.database_extension import db

class Customer(db.Model):
    __tablename__ = 'customers'
    
    customer_id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    loyalty_points = db.Column(db.Integer, default=0)
    address = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    

    orders = db.relationship('Order', back_populates='customer')
    reservations = db.relationship('Reservation', back_populates='customer')