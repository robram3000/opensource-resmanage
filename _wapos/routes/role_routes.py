from flask import Blueprint, request, jsonify
# from ..models import RoleType
# from ..database import db

role_bp = Blueprint('roles', __name__)

# @role_bp.route('/roles', methods=['GET'])
# def get_roles():
#     session = db.get_session()
#     roles = session.query(RoleType).all()
#     return jsonify([{'id': r.id, 'name': r.name} for r in roles])

# def init_app(app):
#     app.register_blueprint(role_bp, url_prefix='/api')