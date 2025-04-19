# from langchain.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from app.models import Grant, Researcher, Match
from pydantic import BaseModel, Field
from app import db
from app.utils.utils import clean_text, compute_fingerprint, chunks
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from app.scraper import get_orcid_profile
import numpy as np
from tqdm import tqdm

model = SentenceTransformer('all-MiniLM-L6-v2')

def prefilter_pairs(researchers, grants, similarity_threshold=0.35):
    results = []
    grant_texts = [clean_text(g.title + " " + g.description) for g in grants]
    researcher_texts = [clean_text(r.keywords) for r in researchers]

    # tfidf = TfidfVectorizer(stop_words='english').fit(grant_texts + researcher_texts)
    # grant_vecs = tfidf.transform(grant_texts)
    grant_vecs = model.encode(grant_texts, normalize_embeddings=True)
    researcher_vecs = model.encode(researcher_texts, normalize_embeddings=True)

    # for r_text, researcher in zip(researcher_texts, researchers):
    #     res_vec = tfidf.transform([r_text])
    for res_vec, researcher in zip(researcher_vecs, researchers):
        # scores = cosine_similarity(res_vec, grant_vecs).flatten()
        scores = np.dot(grant_vecs, res_vec)
        # top_matches = scores.argsort()[-top_k:][::-1]
        top_matches = [i for i, score in enumerate(scores) if score >= similarity_threshold]
        results.append((researcher, [grants[i] for i in top_matches]))

    return results

class MatchedGrant(BaseModel):
    """Matched researcher with a grant with a score and a reason"""
    match_score: float = Field(description="The score of the match between 0 and 1.")
    reason: str = Field(description="The reason for the score.")

def generate_matches(researcher_name=None):
    llm = ChatOpenAI(model="gpt-4.1-mini", temperature=0)

    prompt = ChatPromptTemplate.from_template(
        "Given the researcher's interests: {interests}, and the grant description: {description}, "
        "determine the relevance score between 0 and 1 and give a reason for the score. Be specific and detailed."
        "Only return the score and the reason, no other text, in the format: Score: [score], Reason: [reason]"
    )

    grants = Grant.query.all()
    if not researcher_name:
        researchers = Researcher.query.all()
    else:
        normalized_name = researcher_name.strip().lower()
        researcher = Researcher.query.filter(db.func.lower(Researcher.name) == normalized_name).first()
        
        if not researcher:
            keywords = get_orcid_profile(researcher_name)
            if not keywords:
                raise ValueError(f"Could not find keywords for researcher '{researcher_name}'. Cannot create researcher.")
            
            researcher = Researcher(
                name=researcher_name.strip(),
                keywords=keywords.strip()
            )
            db.session.add(researcher)
            db.session.commit()

        researchers = [researcher]

    
    chain = (prompt | llm.with_structured_output(MatchedGrant)).with_config({"run_name": "grant_matcher"})
    prefiltered = prefilter_pairs(researchers, grants)
    
    seen_fingerprints = {
        m.fingerprint for m in Match.query.with_entities(Match.fingerprint) if m.fingerprint
    }
    
    batch_inputs = []
    meta_pairs = []
    
    # for researcher, top_grants in prefiltered:
    #     for grant in top_grants:
    #         response = chain.invoke({
    #             "interests": researcher.keywords,
    #             "description": grant.title + "\n" + grant.description
    #         })
    #         score = response.match_score
    #         if score > 0.6:
    #             db.session.add(Match(
    #                 researcher_id=researcher.id,
    #                 grant_id=grant.id,
    #                 match_score=score,
    #                 reason=response.reason
    #             ))
    # db.session.commit()
    
    ################# batching ######################
    for researcher, top_grants in prefiltered:
        for grant in top_grants:
            grant_text = grant.title + "\n" + grant.description
            fingerprint = compute_fingerprint(researcher.keywords, grant_text)

            if fingerprint in seen_fingerprints:
                print(f"Skipping {fingerprint} because it's already seen")
                continue
            
            batch_inputs.append({
                "interests": researcher.keywords,
                "description": grant_text
            })
            meta_pairs.append((researcher.id, grant.id, fingerprint))
    
    for input_chunk, meta_chunk in tqdm(zip(chunks(batch_inputs, 10), chunks(meta_pairs, 10))):
        results = chain.batch(input_chunk)
        for (researcher_id, grant_id, fingerprint), result in zip(meta_chunk, results):
            if result.match_score > 0.7:
                db.session.add(Match(
                    researcher_id=researcher_id,
                    grant_id=grant_id,
                    match_score=result.match_score,
                    reason=result.reason,
                    fingerprint=fingerprint
                ))
                seen_fingerprints.add(fingerprint)

    db.session.commit()