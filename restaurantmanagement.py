from flask import Flask
from register_blueprint import register_blueprints

def create_app(neutral_only=False):
    app = Flask(
        __name__,
        static_folder='static',
        template_folder='templates'
    )
    
    register_blueprints(app, neutral_only=neutral_only)
    
    return app

app = create_app()

if __name__ == "__main__":
    import sys
    if '--neutral-only' in sys.argv:
        app = create_app(neutral_only=True)
        print("Running with only neutral blueprint:")
        for rule in app.url_map.iter_rules():
            print(f"- {rule}")
    app.run(debug=True)