from extension.database_extension import db

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    ingredient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    unit_of_measure = db.Column(db.String(20))
    reorder_level = db.Column(db.Numeric(10, 2))
    
    # Relationships
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.supplier_id'))
    supplier = db.relationship('Supplier')
    inventory_transactions = db.relationship('InventoryTransaction', back_populates='ingredient')
    item_ingredients = db.relationship('ItemIngredient', back_populates='ingredient')

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    supplier_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    address = db.Column(db.Text)
    
    # Relationships
    ingredients = db.relationship('Ingredient', back_populates='supplier')