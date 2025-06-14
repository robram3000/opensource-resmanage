import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

# Database configuration (same as your original)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:ramirez@localhost:5432/WAPOS"
)

SQLALCHEMY_ENGINE_OPTIONS = {
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

def test_database_connection():
    """Test if the database connection is working."""
    try:
        # Create engine
        engine = create_engine(DATABASE_URL, **SQLALCHEMY_ENGINE_OPTIONS)
        
        print(f"Attempting to connect to database at: {DATABASE_URL}")
        
        # Test connection
        with engine.connect() as connection:
            # Simple query to check connection
            result = connection.execute(text("SELECT 1"))
            print("✅ Connection successful! Database returned:", result.scalar())
            
            # Optional: Check database version
            db_version = connection.execute(text("SELECT version()")).scalar()
            print(f"Database version: {db_version}")
            
            # Optional: Check current database
            db_name = connection.execute(text("SELECT current_database()")).scalar()
            print(f"Connected to database: {db_name}")
            
        return True
        
    except SQLAlchemyError as e:
        print("❌ Connection failed!")
        print(f"Error: {e}")
        return False
    finally:
        # Dispose the engine
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    test_database_connection()