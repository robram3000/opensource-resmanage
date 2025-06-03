def register_blueprints(app, neutral_only=False):
    if neutral_only:
        from api.route import neutral
        app.register_blueprint(neutral.neutral_np, url_prefix='/neutral')
    else:
        from api.route import admin, staff, neutral
        app.register_blueprint(admin.admin_bp, url_prefix='/admin')
        app.register_blueprint(neutral.neutral_np, url_prefix='/neutral')