


from flask_wtf import FlaskForm
from wtforms import StringField, SelectField
from wtforms.validators import DataRequired

class UnitForm(FlaskForm):
    name = StringField("Unit Name", validators=[DataRequired()])
    abbreviation = StringField("Abbreviation", validators=[DataRequired()])
    type = SelectField("Unit Type", choices=[
        ('', 'Select Type'),
        ('weight', 'Weight'),
        ('volume', 'Volume'),
        ('count', 'Count'),
        ('other', 'Other')
    ], validators=[DataRequired()])