from flask import Blueprint

routes = Blueprint('routes', __name__)

from . import auth_routes , admin_routes

def init_routes(app):
    """
    Initialize routes with the Flask app
    """
    admin_routes.init_app(app)
    auth_routes.init_app(app) 
    app.register_blueprint(routes)
