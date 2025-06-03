from app.package import database


class RoleType(database.Model):
    __tablename__ = 'role_type'
    id = database.Column(database.Integer, primary_key=True)
    name = database.Column(database.String(50), nullable=False, unique=True)
    description = database.Column(database.String(255), nullable=True)

    def __repr__(self):
        return f"<RoleType(id={self.id}, name='{self.name}')>"