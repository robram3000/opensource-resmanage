from flask import Blueprint, render_template, request, flash, redirect, session, url_for

admin = Blueprint('admn', __name__, template_folder='templates')


@admin.route('/Dashboard', methods=['GET', 'POST'])
def Dashboard():
  
    return render_template('pages/adm/admn.html')

def init_app(app):
    app.register_blueprint(admin)