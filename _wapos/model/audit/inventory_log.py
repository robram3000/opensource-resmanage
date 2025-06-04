from datetime import datetime
from extension.database_extension import db

class InventoryAdjustmentLog(db.Model):
    __tablename__ = 'inventory_adjustment_logs'
    
    adjustment_id = db.Column(db.Integer, primary_key=True)
    adjustment_reason = db.Column(db.Text, nullable=False)
    quantity_change = db.Column(db.Numeric(10, 2), nullable=False)  # Positive for addition, negative for deduction
    previous_stock = db.Column(db.Numeric(10, 2))
    new_stock = db.Column(db.Numeric(10, 2))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'))
    ingredient = db.relationship('Ingredient')
    transaction_id = db.Column(db.Integer, db.ForeignKey('inventory_transactions.transaction_id'))
    transaction = db.relationship('InventoryTransaction')
    adjusted_by = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    user = db.relationship('User')

    def __repr__(self):
        return f"<InventoryAdjustmentLog {self.adjustment_id} {self.ingredient_id}>"