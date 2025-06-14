from flask import Flask
from confi import BaseConfig
from routes import init_routes
from logging.handlers import RotatingFileHandler
import logging
import os
from extension.database_extension import db, login_manager, migrate, bcrypt, cors
from werkzeug.security import generate_password_hash
from datetime import datetime

def create_app(config_class=BaseConfig):
    """Application factory pattern"""
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app)
    
    # Configure logging
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

    # Initialize routes
    init_routes(app)
    
    # User loader function
    @login_manager.user_loader
    def load_user(user_id):
        from model import User  # Import here to avoid circular imports
        return User.query.get(int(user_id))

    # Create database tables and initialize admin user (for development)
    with app.app_context():
        db.create_all()
        
        # Check if admin role exists, if not create it
        from model import Role, User
        admin_role = Role.query.filter_by(role_name='admin').first()
        if not admin_role:
            admin_role = Role(
                role_name='admin',
                description='Administrator role with full access',
                permissions={
                    'create': True,
                    'read': True,
                    'update': True,
                    'delete': True
                }
            )
            db.session.add(admin_role)
            db.session.commit()
            app.logger.info('Created admin role')
        
        # Check if admin user exists, if not create it
        admin_email = app.config.get('ADMIN_EMAIL', 'admin@example.com')
        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            admin_password = app.config.get('ADMIN_PASSWORD', 'admin123')
            admin_user = User(
                first_name='Admin',
                last_name='User',
                email=admin_email,
                phone=app.config.get('ADMIN_PHONE', '1234567890'),
                password_hash=generate_password_hash(admin_password),
                is_active=True,
                role_id=admin_role.role_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            db.session.add(admin_user)
            db.session.commit()
            app.logger.info('Created admin user')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=app.config.get('DEBUG', True))