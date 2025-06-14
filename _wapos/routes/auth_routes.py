from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from form.loginform import LoginForm
from services.auth.login_services import LoginService
from services.auth.exception import (InvalidCredentialsError, 
                                   AccountInactiveError)

auth_bp = Blueprint('auth', __name__, template_folder='templates')

@auth_bp.route('/')
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    
    if form.validate_on_submit():
        try:
            # Get the target page from query params or default to dashboard
            target_page = request.args.get('next') or 'dashboard.index'
            required_permission = request.args.get('required_permission')
            
            # Authenticate with optional permission check
            user = LoginService.authenticate_user(
                form.email.data, 
                form.password.data,
                required_permission=required_permission
            )
            print(user)
            token = LoginService.generate_session_token(user)
            
            # Store user session data
            session['auth_token'] = token
            session['user_id'] = user.user_id
            session['email'] = user.email
            session['role'] = user.role.role_name if user.role else None
            session['permissions'] = LoginService.get_user_permissions(user)
            
            flash('Login successful!', 'success')
            return redirect(url_for(target_page))
            
        except InvalidCredentialsError:
            flash('Invalid email or password', 'danger')
        except AccountInactiveError:
            flash('Account is deactivated. Please contact admin.', 'warning')
       
    # Pass form errors to template
    for field, errors in form.errors.items():
        for error in errors:
            flash(f"{getattr(form, field).label.text}: {error}", 'danger')
    
    return render_template('login.html', form_login=form)

@auth_bp.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('auth.login'))

def init_app(app):
    app.register_blueprint(auth_bp)