from flask import Blueprint


routes = Blueprint('routes', __name__)

from . import auth_routes, user_routes, role_routes  #



def init_app(app):
    """
    Initialize routes with the Flask app
    """
    app.register_blueprint(routes)
    auth_routes.init_app(app)
    user_routes.init_app(app)
    role_routes.init_app(app)