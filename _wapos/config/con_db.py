import psycopg2
from psycopg2 import OperationalError
from flask import current_app
from typing import Tuple

def test_connection() -> Tuple[bool, str]:
    """Test database connection and return status and message"""
    try:
        conn = psycopg2.connect(current_app.config['SQLALCHEMY_DATABASE_URI'])
        conn.close()
        return True, "Database connection successful"
    except OperationalError as e:
        return False, f"Database connection failed: {str(e)}"
    except Exception as e:
        return False, f"Unexpected error: {str(e)}"

def get_db_version() -> str:
    """Get the database server version"""
    try:
        conn = psycopg2.connect(current_app.config['SQLALCHEMY_DATABASE_URI'])
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        conn.close()
        return version
    except Exception as e:
        return f"Could not retrieve database version: {str(e)}"
