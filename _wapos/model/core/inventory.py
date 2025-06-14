from extension.database_extension import db
from datetime import datetime

class InventoryTransaction(db.Model):
    __tablename__ = 'inventory_transactions'
    
    transaction_id = db.Column(db.Integer, primary_key=True)
    transaction_type = db.Column(db.String(20), nullable=False)  # PURCHASE, USAGE, ADJUSTMENT
    quantity = db.Column(db.Numeric(10, 2), nullable=False)
    unit_cost = db.Column(db.Numeric(10, 2))
    transaction_date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    
    # Relationships
    ingredient_id = db.Column(db.Integer, db.ForeignKey('ingredients.ingredient_id'))
    ingredient = db.relationship('Ingredient', back_populates='inventory_transactions')

class Ingredient(db.Model):
    __tablename__ = 'ingredients'
    
    ingredient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    unit_of_measure = db.Column(db.String(20))
    current_stock = db.Column(db.Numeric(10, 2), default=0)
    reorder_level = db.Column(db.Numeric(10, 2))
    
    # Relationships
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.supplier_id'))
    supplier = db.relationship('Supplier', back_populates='ingredients')
    inventory_transactions = db.relationship('InventoryTransaction', back_populates='ingredient', cascade='all, delete-orphan')
    menu_items = db.relationship('MenuItem', secondary='menu_item_ingredients', back_populates='ingredients')

    def __repr__(self):
        return f"<Ingredient {self.ingredient_id} {self.name}>"

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    supplier_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    email = db.Column(db.String(100))
    address = db.Column(db.Text)
    
    # Relationships
    ingredients = db.relationship('Ingredient', back_populates='supplier', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Supplier {self.supplier_id} {self.name}>"

# Association table for many-to-many relationship between MenuItem and Ingredient
menu_item_ingredients = db.Table('menu_item_ingredients',
    db.Column('item_id', db.Integer, db.ForeignKey('menu_items.item_id'), primary_key=True),
    db.Column('ingredient_id', db.Integer, db.ForeignKey('ingredients.ingredient_id'), primary_key=True),
    db.Column('quantity_required', db.Numeric(10, 2)),
    db.Column('notes', db.Text)
)