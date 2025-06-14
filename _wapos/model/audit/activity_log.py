from datetime import datetime
from extension.database_extension import db
from ..core.user import User

class SystemActivityLog(db.Model):
    __tablename__ = 'system_activity_logs'
    
    log_id = db.Column(db.Integer, primary_key=True)
    activity_type = db.Column(db.String(50), nullable=False)
    entity_type = db.Column(db.String(50))
    entity_id = db.Column(db.Integer)
    old_values = db.Column(db.JSON)
    new_values = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    device_info = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User', backref=db.backref('activity_logs', lazy='dynamic'))

    def __repr__(self):
        return f"<SystemActivityLog {self.log_id} {self.activity_type}>"