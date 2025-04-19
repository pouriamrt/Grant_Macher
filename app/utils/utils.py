import re
import hashlib
from itertools import islice

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()                           # Lowercase
    text = re.sub(r'\s+', ' ', text)              # Normalize whitespace
    text = re.sub(r'[^\w\s]', '', text)           # Remove punctuation
    return text.strip()

def compute_fingerprint(researcher_keywords, grant_text):
    # If you change the prompt template, you'll want to invalidate previous fingerprints.
    combined = researcher_keywords.strip() + "|" + grant_text.strip()
    return hashlib.md5(combined.encode("utf-8")).hexdigest()

def chunks(iterable, size):
    iterator = iter(iterable)
    for first in iterator:
        yield [first] + list(islice(iterator, size - 1))