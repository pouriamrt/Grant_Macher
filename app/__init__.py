from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
import os
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
mail = Mail()
migrate = Migrate()

def create_app():
    from app.models import Researcher
    from app.utils.import_researchers import import_researchers_from_excel

    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')
    db.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)

    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()
        excel_path = os.environ.get("RESEARCHER_EXCEL_PATH", "data/researchers.xlsx")
        if os.path.exists(excel_path):
            import_researchers_from_excel(excel_path, db, Researcher)

    return app
