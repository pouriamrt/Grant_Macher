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


def remove_duplicates_preserve_order(items):
    seen = set()
    output = []
    for item in items:
        if item not in seen:
            seen.add(item)
            output.append(item)
    return output

def initials_in_email(email, name):
    """Check if the initials of the name appear somewhere in the email username (before the @)."""
    name_parts = name.strip().lower().split()
    if len(name_parts) < 2:
        return False

    first_initial = name_parts[0][0]
    last_initial = name_parts[1][:2]
    
    username = email.split('@')[0].lower()
    return first_initial in username and last_initial in username