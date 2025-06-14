from flask import Blueprint, render_template, request, flash, redirect, session, url_for

pos_bp = Blueprint('pos', __name__, template_folder='templates')

@pos_bp.route('/')
@pos_bp.route('/POS', methods=['GET', 'POST'])
def pos():

    if request.method == 'POST':

        flash('Login functionality not fully implemented yet', 'warning')
        return redirect(url_for('auth.login'))
    return render_template('pages/staff/pos.html'
                        
                      
                           )


def init_app(app):
    app.register_blueprint(pos_bp)
