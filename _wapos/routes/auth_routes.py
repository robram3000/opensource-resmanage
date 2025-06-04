from flask import Blueprint,render_template
from ..model import User  

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    return render_template('login.html')

def init_app(app):
    app.register_blueprint(auth_bp, url_prefix='/auth')