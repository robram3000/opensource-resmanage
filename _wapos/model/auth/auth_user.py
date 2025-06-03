from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class AuthUser(Base):
    __tablename__ = 'auth_user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<AuthUser(id={self.id}, username='{self.username}', email='{self.email}')>"

