from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, FileField, TextAreaField, DateField
from wtforms.validators import DataRequired, Email, EqualTo, Optional
from flask_wtf.file import FileAllowed

class EditUserForm(FlaskForm):
    user_type = SelectField('User Type', 
                          choices=[('', 'Select user type'), 
                                   ('staff', 'Staff'), 
                                   ('supplier', 'Supplier'), 
                                   ('admin', 'Administrator')],
                          validators=[DataRequired()])
    
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    username = StringField('Username', validators=[DataRequired()])
    
    # Make password fields optional for editing
    password = PasswordField('Password', validators=[Optional()])
    confirm_password = PasswordField('Confirm Password', 
                                   validators=[Optional(), 
                                               EqualTo('password', message='Passwords must match')])
    
    role = SelectField('Role', 
                      choices=[('', 'Select role'), 
                               ('admin', 'Administrator'), 
                               ('editor', 'Editor'), 
                               ('viewer', 'Viewer')],
                      validators=[DataRequired()])
    
    avatar = FileField('Profile Picture', validators=[Optional()])

class EditSupplierForm(FlaskForm):
    supplier_name = StringField('Supplier Name', validators=[DataRequired()])
    contact_person = StringField('Contact Person', validators=[DataRequired()])
    email = StringField('Email Address', validators=[DataRequired(), Email()])
    phone_number = StringField('Phone Number', validators=[DataRequired()])
    address = TextAreaField('Address', validators=[DataRequired()], render_kw={"rows": 3})
    
    supplier_type = SelectField('Supplier Type',
                              choices=[('', 'Select type'),
                                       ('food', 'Food'),
                                       ('beverage', 'Beverage'),
                                       ('equipment', 'Equipment'),
                                       ('other', 'Other')],
                              validators=[DataRequired()])
    
    tax_id = StringField('Tax ID/VAT Number', validators=[DataRequired()])
    contract_start = DateField('Contract Start Date', validators=[DataRequired()], format='%Y-%m-%d')
    
    contract_file = FileField('Contract Document',
                            validators=[Optional(),
                                        FileAllowed(['pdf', 'doc', 'docx'], 
                                                   'Only PDF and Word documents allowed')])
    
    notes = TextAreaField('Notes', validators=[Optional()], render_kw={"rows": 2})