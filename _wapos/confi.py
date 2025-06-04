import os
from dotenv import load_dotenv

load_dotenv()
class Config:

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URI', 'postgresql://username:password@localhost:5432/wapos')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,  
        'pool_recycle': 300,    
    }