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


@admin.route('/table-manage', methods=['GET', 'POST'])
def table_manage():
    return render_template('pages/adm/tablemanagement/tabletemplate.html')
@admin.route('/booking-calendar', methods=['GET', 'POST'])
def booking_calendar():
    return render_template('pages/adm/tablemanagement/bookingcalendar.html')


@admin.route('/stocks-level', methods=['GET', 'POST'])
def stocks_level():
    return render_template('pages/adm/inventorymanagement/stocklevels.html')


@admin.route('/menu-management', methods = ['GET','POS'] )
def menu_management():
    
    return render_template('pages/adm/menumanagement/menu.html')
def init_app(app):
    app.register_blueprint(admin)