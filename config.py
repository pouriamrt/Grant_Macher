import os
from dotenv import load_dotenv

load_dotenv(".env", override=True)

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SESSION_TYPE = 'filesystem'
    RESULTS_PER_PAGE = 5
    TEMPLATES_AUTO_RELOAD = True
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')\
        or 'sqlite:///' + os.path.join(basedir, 'app.db') #'postgresql://user:password@localhost/grantmatch'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'pouriamortezaagha7@gmail.com'
    MAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD')
    MAIL_USE_TLS = True
    MAIL_DEFAULT_SENDER = 'pouriamortezaagha7@gmail.com'