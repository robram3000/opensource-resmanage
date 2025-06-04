from extension.database_extension import db

class Table(db.Model):
    __tablename__ = 'tables'
    
    table_id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.String(10), unique=True, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='Available')  # Available, Occupied, Reserved
    
    # Relationships
    orders = db.relationship('Order', back_populates='table')
    reservations = db.relationship('Reservation', back_populates='table')