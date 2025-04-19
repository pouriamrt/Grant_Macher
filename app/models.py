from app import db
from sqlalchemy.schema import UniqueConstraint

class Researcher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    position = db.Column(db.String)
    program = db.Column(db.String)
    keywords = db.Column(db.Text)
    email = db.Column(db.String)

class Grant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    description = db.Column(db.Text)
    deadline = db.Column(db.String)
    amount = db.Column(db.String)
    source = db.Column(db.String)

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    researcher_id = db.Column(db.Integer, db.ForeignKey('researcher.id'))
    grant_id = db.Column(db.Integer, db.ForeignKey('grant.id'))
    match_score = db.Column(db.Float)
    reason = db.Column(db.Text)
    fingerprint = db.Column(db.String, unique=True)
    
    researcher = db.relationship('Researcher', backref='matches', lazy=True)
    grant = db.relationship('Grant', backref='matches', lazy=True)

    __table_args__ = (
        UniqueConstraint('researcher_id', 'grant_id', name='uq_researcher_grant'),
        UniqueConstraint('fingerprint', name='uq_fingerprint'),
    )
