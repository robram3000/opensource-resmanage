from datetime import datetime
from extension.database_extension import db

class FinancialAuditLog(db.Model):
    __tablename__ = 'financial_audit_logs'
    
    audit_id = db.Column(db.Integer, primary_key=True)
    field_changed = db.Column(db.String(50), nullable=False)
    old_value = db.Column(db.String(255))
    new_value = db.Column(db.String(255))
    reason = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    payment_id = db.Column(db.Integer, db.ForeignKey('payments.payment_id'))
    payment = db.relationship('Payment')
    changed_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User')