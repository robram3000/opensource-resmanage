from flask import Blueprint, render_template, request, flash, redirect, session, url_for

auth_bp = Blueprint('auth', __name__, template_folder='templates')

@auth_bp.route('/')
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':

        flash('Login functionality not fully implemented yet', 'warning')
        return redirect(url_for('auth.login'))
    return render_template('login.html')

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'success')
    return redirect(url_for('auth.login'))

def init_app(app):
    app.register_blueprint(auth_bp)
