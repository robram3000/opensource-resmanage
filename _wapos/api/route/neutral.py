from flask import Blueprint,render_template

neutral_np = Blueprint('neutral', __name__ ,  static_folder='static',
    template_folder='../WEB/templates')

@neutral_np.route('/login')
def Login():
     
    return render_template('base.html')