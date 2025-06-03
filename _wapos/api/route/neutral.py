from flask import Blueprint,render_template

neutral_np = Blueprint('neutral', __name__,
                      static_folder='static',
                      template_folder='templates')

@neutral_np.route('/login')
def Login():
     
    return render_template('login.html')