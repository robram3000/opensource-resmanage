from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, FileField
from wtforms.validators import DataRequired, Email, EqualTo

class AddUserForm(FlaskForm):
    user_type = SelectField('User Type', 
                          choices=[('', 'Select user type'), 
                                   ('staff', 'staff'), 
                                   ('supplier', 'Supplier'), 
                                   ('admin', 'Administrator')],
                          validators=[DataRequired()])
    
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', 
                                   validators=[DataRequired(), 
                                               EqualTo('password', message='Passwords must match')])
    role = SelectField('Role', 
                      choices=[('', 'Select role'), 
                               ('admin', 'Administrator'), 
                               ('editor', 'Editor'), 
                               ('viewer', 'Viewer')],
                      validators=[DataRequired()])
    avatar = FileField('Profile Picture')