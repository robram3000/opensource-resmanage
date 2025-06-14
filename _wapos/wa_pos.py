from flask import Flask
from confi import BaseConfig
from routes import init_routes
from logging.handlers import RotatingFileHandler
import logging
import os
from extension.database_extension import db, login_manager, migrate, bcrypt, cors

def create_app(config_class=BaseConfig):
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config.from_object(config_class)
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app)
    
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/restaurant.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('Restaurant startup')

    init_routes(app)
    @login_manager.user_loader
    def load_user(user_id):
        from model import User 
        return User.query.get(int(user_id))

    # Create database tables (for development)
    # with app.app_context():
    #     db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=app.config.get('DEBUG', True))