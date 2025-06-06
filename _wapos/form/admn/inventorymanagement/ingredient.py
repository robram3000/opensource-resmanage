from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, FileField, TextAreaField, DateField
from wtforms.validators import DataRequired, Email, EqualTo, Optional
from flask_wtf.file import FileAllowed


class ingredient(FlaskForm):
        ingredient = StringField("")