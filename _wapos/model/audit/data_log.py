from datetime import datetime
from extension.database_extension import db
from ..core.user import User

class DataChangeLog(db.Model):
    __tablename__ = 'data_change_logs'
    
    change_id = db.Column(db.Integer, primary_key=True)
    table_name = db.Column(db.String(50), nullable=False)
    record_id = db.Column(db.Integer, nullable=False)
    change_type = db.Column(db.String(20), nullable=False)  # CREATE, UPDATE, DELETE
    change_details = db.Column(db.JSON)  # Stores field-level changes
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    changed_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User', backref=db.backref('data_changes', lazy='dynamic'))

    def __repr__(self):
        return f"<DataChangeLog {self.change_id} {self.table_name}.{self.record_id}>"