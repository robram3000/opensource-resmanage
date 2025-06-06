from flask import Flask
from routes import init_routes
from flask_sqlalchemy import SQLAlchemy
import confi 

wa_pos = Flask(__name__,
            template_folder="templates",
            static_folder="static")

wa_pos.config.from_object(confi.Config)
init_routes(wa_pos)
db = SQLAlchemy(wa_pos)


if __name__ == '__main__':
    wa_pos.run(debug=True)