from datetime import datetime
from extension.database_extension import db

class Reservation(db.Model):
    __tablename__ = 'reservations'
    
    reservation_id = db.Column(db.Integer, primary_key=True)
    reservation_time = db.Column(db.DateTime, nullable=False)
    party_size = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='Confirmed')  # Confirmed, Cancelled, No-show
    notes = db.Column(db.Text)
    
    # Relationships
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    customer = db.relationship('Customer', back_populates='reservations')
    table_id = db.Column(db.Integer, db.ForeignKey('tables.table_id'))
    table = db.relationship('Table', back_populates='reservations')