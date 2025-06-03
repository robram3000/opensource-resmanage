from flask import Blueprint, jsonify, request , render_template

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/delete', methods=['DELETE'])
def admn_dashboard():

    return render_template('admin_dashboard.html')
    