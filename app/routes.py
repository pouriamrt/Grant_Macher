from flask import Blueprint, jsonify, request
from app.models import Match, Researcher, Grant
from app import mail, db
from flask_mail import Message
from app.agents.grant_matcher import generate_matches
from app.scraper import scrape_nih_api, scrape_cihr_ai, find_email, scrape_cbrf_ai

main = Blueprint('main', __name__)

@main.route('/generate_matches', methods=['POST'])
def run_match_agent():
    try:
        researcher_name = request.form['researcher_name']
    except:
        researcher_name = None
    # Get thresholds from request, with defaults
    try:
        threshold = float(request.form.get('threshold', 0.7))
    except:
        threshold = 0.7
    try:
        similarity_threshold = float(request.form.get('similarity_threshold', 0.35))
    except:
        similarity_threshold = 0.35
    generate_matches(researcher_name, threshold, similarity_threshold)
    return jsonify({"status": "Matches generated using AI agent."})

@main.route('/send_matches', methods=['POST'])
def send_matches():
    match_id = request.form.get('match_id', None)

    if match_id:
        match = Match.query.filter_by(id=match_id).first()
        if not match:
            return jsonify({"error": "No match found with the given ID."}), 404
        matches = [match]
    else:
        matches = Match.query.all()

    sent_emails = 0
    for match in matches:
        if not match:
            continue
        
        researcher = Researcher.query.get(match.researcher_id)
        grant = Grant.query.get(match.grant_id)
        
        if not researcher or not grant:
            continue
        print(f"Preparing to email researcher: {researcher.name}")

        emails = find_email(researcher.name)
        if not emails:
            print(f"No emails found for {researcher.name}, skipping.")
            continue

        for email in emails:
            try:
                msg = Message(
                    subject="Grant Match Found!",
                    recipients=[email]
                )
                msg.body = (
                    f"Hi {researcher.name},\n\n"
                    f"We found a potential grant match for you:\n\n"
                    f"Title: {grant.title}\n"
                    f"Description: {grant.description}\n"
                    f"Source: {grant.source}\n"
                    f"Amount: {grant.amount}\n"
                    f"Deadline: {grant.deadline}\n"
                    f"Score: {match.match_score:.2f}\n\n"
                    f"Explanation: {match.reason}\n\n"
                    f"Best regards,\nGrant Matcher Team"
                )
                mail.send(msg)
                sent_emails += 1
                print(f"Email successfully sent to {email}")
            except Exception as e:
                print(f"Failed to send email to {email}: {str(e)}")

    if sent_emails == 0:
        return jsonify({"warning": "No emails were sent. Check if researchers have valid emails."}), 200

    return jsonify({"status": f"{sent_emails} emails sent successfully."}), 200


@main.route('/scrape_nih', methods=['POST'])
def scrape_nih():
    scrape_nih_api()
    return jsonify({"status": "NIH grants scraped and stored."})

@main.route('/scrape_cihr', methods=['POST'])
def scrape_cihr():
    scrape_cihr_ai()
    return jsonify({"status": "CIHR grants scraped and stored."})

@main.route('/scrape_cbrf', methods=['POST'])
def scrape_cbrf():
    scrape_cbrf_ai()
    return jsonify({"status": "CBRF grants scraped and stored."})


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
            'id': m.id,
            'researcher_name': m.researcher.name if m.researcher else None,
            'grant_title': m.grant.title if m.grant else None,
            'match_score': m.match_score,
            'reason': m.reason,
            'feedback': m.feedback
        }
        for m in matches
    ]
    return jsonify(result)

@main.route('/matches/<int:match_id>/feedback', methods=['POST'])
def set_match_feedback(match_id):
    data = request.get_json()
    feedback = data.get('feedback') if data else None
    if feedback not in ['up', 'down', None]:
        return jsonify({'error': 'Invalid feedback'}), 400
    match = Match.query.get_or_404(match_id)
    match.feedback = feedback
    db.session.commit()
    return jsonify({'status': 'Feedback updated'})
