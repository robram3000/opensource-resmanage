from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, DateField, FileField
from wtforms.validators import DataRequired, Email, Optional
from flask_wtf.file import FileAllowed

class AddSupplierForm(FlaskForm):
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