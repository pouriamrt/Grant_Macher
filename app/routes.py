from flask import Blueprint, jsonify, request
from app.models import Match, Researcher, Grant
from app import mail
from flask_mail import Message
from app.agents.grant_matcher import generate_matches
from app.scraper import scrape_nih_api, scrape_cihr_ai

main = Blueprint('main', __name__)

@main.route('/generate_matches', methods=['POST'])
def run_match_agent():
    try:
        researcher_name = request.form['researcher_name']
    except:
        researcher_name = None
    generate_matches(researcher_name)
    return jsonify({"status": "Matches generated using AI agent."})

@main.route('/send_matches', methods=['POST'])
def send_matches():
    matches = Match.query.all()
    for match in matches:
        researcher = Researcher.query.get(match.researcher_id)
        grant = Grant.query.get(match.grant_id)
        explanation = f"This grant aligns with your interests in {researcher.keywords}."
        msg = Message("Grant Match Found!", recipients=[researcher.email])
        msg.body = f"Hi {researcher.name},\n\nWe found a potential grant match for you:\n\nTitle: {grant.title}\nDescription: {grant.description}\nSource: {grant.source}\nScore: {match.match_score:.2f}\n\nExplanation: {explanation}"
        mail.send(msg)
    return jsonify({"status": "Emails sent"})

@main.route('/scrape_nih', methods=['POST'])
def scrape_nih():
    scrape_nih_api()
    return jsonify({"status": "NIH grants scraped and stored."})

@main.route('/scrape_cihr', methods=['POST'])
def scrape_cihr():
    scrape_cihr_ai()
    return jsonify({"status": "CIHR grants scraped and stored."})




@main.route('/researchers')
def get_researchers():
    researchers = Researcher.query.all()
    result = [{'id': r.id, 'name': r.name} for r in researchers]
    return jsonify(result)

@main.route('/researchers/<int:id>')
def get_researcher_detail(id):
    researcher = Researcher.query.get_or_404(id)
    return jsonify({'id': researcher.id, 'name': researcher.name, 'position': researcher.position,
                    'program': researcher.program, 'email': researcher.email, 'keywords': researcher.keywords})


@main.route('/grants')
def get_grants():
    grants = Grant.query.all()
    result = [{'id': g.id, 'title': g.title} for g in grants]
    return jsonify(result)

@main.route('/grants/<int:id>')
def get_grant_detail(id):
    grant = Grant.query.get_or_404(id)
    return jsonify({'id': grant.id, 'title': grant.title, 'description': grant.description, 
                    'source': grant.source, 'amount': grant.amount, 'deadline': grant.deadline})


@main.route('/matches')
def get_matches():
    matches = Match.query.all()
    result = [
        {
            'researcher_name': m.researcher.name if m.researcher else None,
            'grant_title': m.grant.title if m.grant else None,
            'match_score': m.match_score,
            'reason': m.reason
        }
        for m in matches
    ]
    return jsonify(result)
