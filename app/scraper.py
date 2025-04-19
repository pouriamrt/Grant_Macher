import requests
from app.models import Grant
from app import db
from scrapegraphai.graphs import SmartScraperGraph
# import json
import time
from serpapi import GoogleSearch
from dotenv import load_dotenv
from os import getenv

load_dotenv(".env", override=True)

########################### CIHR ###########################
def scrape_cihr_ai():
    graph_config = {
        "llm": {
            "api_key": getenv("OPENAI_API_KEY"),
            "model": "openai/gpt-4o-mini",
            "temperature": 0.0,
        },
        "verbose": True,
        "headless": True,
    }
    BASE_URL = "https://cihr-irsc.gc.ca/e"
    
    scraper = SmartScraperGraph(
        prompt="Extract the links to the upcoming funding opportunities details from the webpage.",
        source=f"{BASE_URL}/51605.html",
        config=graph_config,
    )
    reference = scraper.run()
    
    if not reference or "content" not in reference or len(reference["content"]) <= 1:
        raise ValueError("No links were extracted from the source page.")
    
    results = []
    for idx, item in enumerate(reference["content"][1:], start=1):
        item_link = item.replace(":", "").strip()
        full_url = f"{BASE_URL}{item_link}"
        print(f"[{idx}] Scraping: {full_url}")
        try:
            detail_scraper = SmartScraperGraph(
                prompt=(
                    "Extract the grant topic, abstract, available_funds, and deadline from the grant details page. "
                    "Each category may contain multiple values; extract all available information."
                    "If the information is not available, return 'N/A'."
                    "Return the information in a dictionary format and all keys and values should be strings and only one value per key."
                    "Include number of grants, number of years for the grant inside the available_funds value if available."
                ),
                source=full_url,
                config=graph_config,
            )

            result = detail_scraper.run()
            results.append({
                "url": full_url,
                "data": result,
            })
            
            title = result["content"].get("grant_topic", "").replace("N/A", "")
            description = result["content"].get("abstract", "").replace("N/A", "")
            deadline = result["content"].get("deadline", "").replace("N/A", "")
            amount = result["content"].get("available_funds", "").replace("N/A", "")
            source = "CIHR"
            
            existing_grant = Grant.query.filter_by(title=title, source=source).first()
            if existing_grant:
                print(f"Skipping duplicate grant: {title}")
                continue
            
            db.session.add(Grant(title=title, description=description, deadline=deadline, amount=amount, source=source))
            
            time.sleep(0.5)

        except Exception as e:
            print(f"Failed to scrape {full_url}: {e}")
            continue
        
    # print(json.dumps(results, indent=4))
    db.session.commit()
    
    
########################### NIH ###########################
def scrape_nih_api():
    url = "https://api.reporter.nih.gov/v2/projects/search"
    headers = {"Content-Type": "application/json"}
    payload = {
        "criteria": {
            "fiscal_years": [2025],
            "activity_codes": ["R01", "R21", "P01"]
        },
        "include_fields": ["ProjectTitle", "AbstractText", "AwardAmount", "AwardNoticeDate", "FundingICs"],
        "offset": 0,
        "limit": 25
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        for project in data.get("results", []):
            title = project.get("project_title", "")
            description = project.get("abstract_text", "")
            deadline = project.get("award_notice_date", "")
            amount = project.get("award_amount", "")
            source = "NIH"
            
            existing_grant = Grant.query.filter_by(title=title, source=source).first()
            if existing_grant:
                print(f"Skipping duplicate NIH grant: {title}")
                continue
            
            db.session.add(Grant(title=title, description=description, deadline=deadline, amount=amount, source=source))
        db.session.commit()
    else:
        print("Failed to fetch NIH grants:", response.status_code)


########################### ORCID ###########################
def search_google_serpapi(query):
    params = {
        "engine": "google",
        "q": query,
        "google_domain": "google.ca",
        "api_key": getenv("SERP_API_KEY"),
    }
    search = GoogleSearch(params)
    results = search.get_dict()
    return [(r['title'], r['link']) for r in results.get('organic_results', [])]

def create_profile_paragraph(profile):
    parts = []
    # 1. Name
    try:
        given = profile['person']['name']['given-names']['value']
        family = profile['person']['name']['family-name']['value']
        full_name = f"{given} {family}"
        parts.append(full_name)
    except (KeyError, TypeError):
        pass

    # 2. Biography
    try:
        bio = profile['person']['biography']['content']
        if bio:
            parts.append(bio)
    except (KeyError, TypeError):
        pass

    # 3. Keywords (list)
    try:
        keywords = [kw['content'] for kw in profile['person']['keywords']['keyword']]
        parts.append("Keywords: " + ", ".join(keywords))
    except (KeyError, TypeError):
        pass

    # 4. Last Work Title
    try:
        work_titles = [w['work-summary'][0]['title']['title']['value'] for w in profile['activities-summary']['works']['group']]
        parts.append("Recent Work: " + ", ".join(work_titles))
    except (KeyError, IndexError, TypeError):
        pass

    # 5. Last Funding Title
    try:
        funding_title = profile['activities-summary']['fundings']['group'][-1]['funding-summary'][0]['title']['title']['value']
        parts.append(f"Recent Funding: {funding_title}")
    except (KeyError, IndexError, TypeError):
        pass

    # Join all parts into one clean paragraph
    paragraph = ". ".join(parts) + "."
    return paragraph

def get_orcid_profile(scientist_name):
    orcid_id = search_google_serpapi('site:orcid.org "' + scientist_name + '"')
    if "orcid.org" in orcid_id[0][1]:
        orcid_id = orcid_id[0][1].split("/")[-1]
    else:
        return None
    headers = {"Accept": "application/json"}
    url = f"https://pub.orcid.org/v3.0/{orcid_id}/record"
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        profile = response.json()
        scientist_interests_bio = create_profile_paragraph(profile)
        return scientist_interests_bio
    else:
        print(f"Error: {response.status_code}")
        return None
    