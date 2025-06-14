from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()
cors = CORS()
login_manager = LoginManager()