from datetime import datetime
from extension.database_extension import db

class AuthenticationLog(db.Model):
    __tablename__ = 'authentication_logs'
    
    auth_id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(20), nullable=False)  # LOGIN, LOGOUT, PASSWORD_CHANGE, etc.
    status = db.Column(db.String(20), nullable=False)  # SUCCESS, FAILED, LOCKED
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User')

    def __repr__(self):
        return f"<AuthenticationLog {self.auth_id} {self.user_id} {self.action}>"