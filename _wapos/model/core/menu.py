from extension.database_extension import db

class MenuCategory(db.Model):
    __tablename__ = 'menu_categories'
    
    category_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    
    items = db.relationship('MenuItem', back_populates='category')

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    item_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    cost_price = db.Column(db.Numeric(10, 2))
    is_available = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255))
    preparation_time = db.Column(db.Integer)  # in minutes
    
    # Relationships
    category_id = db.Column(db.Integer, db.ForeignKey('menu_categories.category_id'))
    category = db.relationship('MenuCategory', back_populates='items')
    order_items = db.relationship('OrderItem', back_populates='item')
    ingredients = db.relationship('ItemIngredient', back_populates='item')