from flask import Blueprint, render_template

admin = Blueprint('admn', __name__, template_folder='templates')



@admin.route('/Dashboard', methods=['GET', 'POST'])
def dashboard():
    return render_template('pages/adm/admn.html')


@admin.route('/manage-user', methods=['GET', 'POST'])
def manage_user():
    return render_template('pages/adm/staffmanagement/manageuser.html')


@admin.route('/activity-logs', methods=['GET', 'POST'])
def activity_logs():
    return render_template('pages/adm/staffmanagement/activitylogs.html')


def init_app(app):
    app.register_blueprint(admin)