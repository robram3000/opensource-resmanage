import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://username:password@localhost:5432/wapos')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,      # Test connections for liveness before using
        'pool_recycle': 300,        # Recycle connections after 300 seconds
        'pool_size': 10,           # Number of connections to keep in pool
        'max_overflow': 20,         # Max number of connections beyond pool_size
        'pool_timeout': 30          # Seconds to wait for a connection from pool
    }
    
    # Security Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'roberto-v-ramirez-jr-03-30-2000')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key')
    
    # Session Configuration
    SESSION_COOKIE_SECURE = True    # Only send cookies over HTTPS
    SESSION_COOKIE_HTTPONLY = True  # Prevent JavaScript access to cookies
    SESSION_COOKIE_SAMESITE = 'Lax' # CSRF protection
    
    # Application Settings
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    TESTING = os.getenv('TESTING', 'False') == 'True'
    
    # File Uploads
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB upload limit
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
    
    # Email Configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.example.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', 'user@example.com')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', 'password')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@example.com')
    
    # Caching
    CACHE_TYPE = os.getenv('CACHE_TYPE', 'SimpleCache')
    CACHE_DEFAULT_TIMEOUT = int(os.getenv('CACHE_DEFAULT_TIMEOUT', 300))
    
    # API Settings
    API_PREFIX = '/api/v1'
    JSON_SORT_KEYS = False
    
    # CORS Configuration (if your API has frontend clients)
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',') if os.getenv('CORS_ORIGINS') else []
    
    
