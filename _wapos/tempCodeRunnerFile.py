from flask import Flask
from routes import init_routes

app = Flask(__name__,
            template_folder="templates",
            static_folder="static")
init_routes(app)

if __name__ == '__main__':
    app.run(debug=True)