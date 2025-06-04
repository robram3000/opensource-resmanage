from flask import Blueprint

routes = Blueprint('routes', __name__)

from . import auth_routes

def init_routes(app):
    """
    Initialize routes with the Flask app
    """
    auth_routes.init_app(app)  # This now matches the function in auth_routes.py
    app.register_blueprint(routes)