from flask import Flask
from routes import init_routes
import secrets
app = Flask(__name__,
            template_folder="templates",
            static_folder="static")
init_routes(app)

secrets_key = secrets.token_hex(16)
app.config['SECRET_KEY'] = secrets_key


if __name__ == '__main__':
    app.run(debug=True)