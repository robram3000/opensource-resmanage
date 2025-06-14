import click
from flask.cli import AppGroup
from wa_pos import create_app
from model import db, User, Role  

app = create_app()

# Create a CLI group
cli = AppGroup('cli')

@cli.command("create-admin")
@click.argument("email")
@click.argument("password")
def create_admin(email, password):
    """Create an admin user"""
    with app.app_context():
        # Check if admin role exists
        admin_role = Role.query.filter_by(role_name='Admin').first()
        if not admin_role:
            admin_role = Role(
                role_name='Admin',
                description='System administrator with full access',
                permissions={'all': True}
            )
            db.session.add(admin_role)
            db.session.commit()
        
        # Create admin user
        user = User(
            first_name='Admin',
            last_name='User',
            email=email,
            role_id=admin_role.role_id
        )
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
    
    print(f"Admin user {email} created successfully!")

# Register the CLI group with the application
app.cli.add_command(cli)