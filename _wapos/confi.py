import os
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional
from pathlib import Path
from datetime import timedelta

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

class BaseConfig:
    """Base configuration with default settings"""
    
    # Application Meta
    APP_NAME: str = "Restaurant Management"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = '/api/v1'
    SERVER_NAME: Optional[str] = os.getenv('SERVER_NAME')
    

    SECRET_KEY: str = os.getenv('SECRET_KEY', 'default-insecure-key-change-me')
    JWT_SECRET_KEY: str = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(
        minutes=int(os.getenv('JWT_ACCESS_EXPIRES_MINUTES', 60))
    )
    JWT_REFRESH_TOKEN_EXPIRES: timedelta = timedelta(
        days=int(os.getenv('JWT_REFRESH_EXPIRES_DAYS', 30))
    )
    
    # Session Security
    SESSION_COOKIE_SECURE: bool = os.getenv('SESSION_COOKIE_SECURE', 'True') == 'True'
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = 'Lax'
    PERMANENT_SESSION_LIFETIME: timedelta = timedelta(days=1)
    
    # Database
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:ramirez@localhost:5432/WAPOS'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    SQLALCHEMY_ENGINE_OPTIONS: Dict[str, Any] = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 10,
        'max_overflow': 20,
        'pool_timeout': 30,
        'connect_args': {
            'connect_timeout': 5,
            'application_name': 'restaurant_app'
        }
    }
    

    # File Uploads
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16MB max upload
    UPLOAD_FOLDER: str = os.path.join(BASE_DIR, 'uploads')
    ALLOWED_EXTENSIONS: set = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}
    
    # Performance
    JSON_SORT_KEYS: bool = False
    JSONIFY_PRETTYPRINT_REGULAR: bool = False
    
    # Email
    MAIL_SERVER: str = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT: int = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS: bool = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME: str = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD: str = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER: str = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@restaurant.com')
    
    # Cache
    CACHE_TYPE: str = os.getenv('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT: int = int(os.getenv('CACHE_TIMEOUT', 300))
    
    # Celery
    CELERY_BROKER_URL: str = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND: str = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

class DevelopmentConfig(BaseConfig):
    """Development specific configuration"""
    DEBUG: bool = True
    TESTING: bool = False
    EXPLAIN_TEMPLATE_LOADING: bool = False
    
    # Allow more verbose database queries
    SQLALCHEMY_ECHO: bool = os.getenv('SQLALCHEMY_ECHO', 'False') == 'True'
    
    # CORS for development
    CORS_ORIGINS: List[str] = os.getenv('CORS_ORIGINS', '*').split(',')
    
    # Disable CSRF for API testing
    WTF_CSRF_ENABLED: bool = False

class ProductionConfig(BaseConfig):
    """Production specific configuration"""
    DEBUG: bool = False
    TESTING: bool = False
    
    # Enhanced security for production
    PROPAGATE_EXCEPTIONS: bool = True  # Don't leak stack traces
    PRESERVE_CONTEXT_ON_EXCEPTION: bool = False
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_SAMESITE: str = 'Strict'
    
    # Production database pool settings
    SQLALCHEMY_ENGINE_OPTIONS: Dict[str, Any] = {
        **BaseConfig.SQLALCHEMY_ENGINE_OPTIONS,
        'pool_size': 20,
        'max_overflow': 30,
        'pool_pre_ping': True,
        'pool_recycle': 3600
    }
    
    # Strict CORS for production
    CORS_ORIGINS: List[str] = os.getenv('CORS_ORIGINS', '').split(',') if os.getenv('CORS_ORIGINS') else []

class TestingConfig(BaseConfig):
    """Testing specific configuration"""
    TESTING: bool = True
    DEBUG: bool = False
    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        'TEST_DATABASE_URL', 
        'postgresql://postgres:ramirez@localhost:5432/restaurant_test'
    )
    WTF_CSRF_ENABLED: bool = False
    PRESERVE_CONTEXT_ON_EXCEPTION: bool = False
    SQLALCHEMY_ECHO: bool = False

def get_config() -> BaseConfig:
    """Get the appropriate config class based on environment"""
    env = os.getenv('FLASK_ENV', 'development').lower()
    
    config_mapping = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
        'testing': TestingConfig
    }
    
    return config_mapping.get(env, DevelopmentConfig)()

# Initialize the config
Config = get_config()