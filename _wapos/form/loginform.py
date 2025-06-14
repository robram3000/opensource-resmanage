from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, Length, ValidationError
from email_validator import validate_email, EmailNotValidError

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired(message='Email is required'),
        Length(max=100),
        # Custom email validator
        lambda form, field: validate_email_or_raise(field.data)
    ], render_kw={"placeholder": "your@email.com"})
    
    password = PasswordField('Password', validators=[
        DataRequired(message='Password is required'),
        Length(min=6, message='Password must be at least 6 characters')
    ], render_kw={"placeholder": "********"})
    
    remember = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

def validate_email_or_raise(email):
    """Custom email validation that provides better error messages"""
    if not email:
        raise ValidationError('Email is required')
    try:
        validate_email(email)
    except EmailNotValidError as e:
        raise ValidationError(str(e))