import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SESSION_TYPE = 'filesystem'
    RESULTS_PER_PAGE = 5
    TEMPLATES_AUTO_RELOAD = True
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')\
        or 'sqlite:///' + os.path.join(basedir, 'app.db') #'postgresql://user:password@localhost/grantmatch'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAIL_SERVER = 'smtp.example.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'noreply@example.com'
    MAIL_PASSWORD = 'yourpassword'
    MAIL_USE_TLS = True
    MAIL_DEFAULT_SENDER = 'noreply@example.com'