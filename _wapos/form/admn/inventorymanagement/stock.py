
from flask_wtf import FlaskForm
from wtforms import StringField, SelectField, DecimalField, IntegerField
from wtforms.validators import DataRequired, Optional, NumberRange

class StockForm(FlaskForm):
    ingredient_id = SelectField("Ingredient", coerce=int, validators=[DataRequired()])
    quantity = DecimalField("Quantity", places=2, validators=[
        DataRequired(),
        NumberRange(min=0.01, message="Quantity must be positive")
    ])
    unit_id = SelectField("Unit", coerce=int, validators=[DataRequired()])
    purchase_date = StringField("Purchase Date", validators=[Optional()])
    expiry_date = StringField("Expiry Date", validators=[Optional()])
    cost_per_unit = DecimalField("Cost Per Unit", places=2, validators=[
        Optional(),
        NumberRange(min=0, message="Cost cannot be negative")
    ])
    supplier = StringField("Supplier", validators=[Optional()])
    location = StringField("Storage Location", validators=[Optional()]) 