"""
Performance benchmarks for utility functions in the Grant Matcher application.
"""
import pytest
from app.utils.utils import clean_text, compute_fingerprint, chunks, remove_duplicates_preserve_order, initials_in_email


@pytest.mark.benchmark
def test_clean_text_short(benchmark):
    """Benchmark clean_text with a short string."""
    text = "Hello, World! This is a test."
    result = benchmark(clean_text, text)
    assert isinstance(result, str)


@pytest.mark.benchmark
def test_clean_text_long(benchmark):
    """Benchmark clean_text with a long string."""
    text = """
    This is a much longer text with multiple sentences. It contains various punctuation marks!
    Question marks? And even some special characters like @#$%. We also have multiple lines
    and extra    whitespace    that needs to be normalized. The text continues with more
    content to simulate a realistic grant description or researcher profile.
    """ * 10
    result = benchmark(clean_text, text)
    assert isinstance(result, str)


@pytest.mark.benchmark
def test_compute_fingerprint(benchmark):
    """Benchmark fingerprint computation."""
    researcher_keywords = "machine learning, artificial intelligence, deep learning, neural networks"
    grant_text = """
    Research Grant for Advanced Machine Learning Applications
    
    This grant supports innovative research in machine learning and artificial intelligence,
    with a focus on deep learning techniques and neural network architectures.
    """
    result = benchmark(compute_fingerprint, researcher_keywords, grant_text)
    assert isinstance(result, str)
    assert len(result) == 32  # MD5 hash length


@pytest.mark.benchmark
def test_chunks_small(benchmark):
    """Benchmark chunks function with small data."""
    data = list(range(100))
    result = benchmark(lambda: list(chunks(data, 10)))
    assert len(result) == 10


@pytest.mark.benchmark
def test_chunks_large(benchmark):
    """Benchmark chunks function with large data."""
    data = list(range(10000))
    result = benchmark(lambda: list(chunks(data, 100)))
    assert len(result) == 100


@pytest.mark.benchmark
def test_remove_duplicates_small(benchmark):
    """Benchmark remove_duplicates_preserve_order with small list."""
    items = [1, 2, 3, 2, 4, 1, 5, 3, 6]
    result = benchmark(remove_duplicates_preserve_order, items)
    assert result == [1, 2, 3, 4, 5, 6]


@pytest.mark.benchmark
def test_remove_duplicates_large(benchmark):
    """Benchmark remove_duplicates_preserve_order with large list."""
    items = list(range(1000)) + list(range(500))  # 1500 items with 500 duplicates
    result = benchmark(remove_duplicates_preserve_order, items)
    assert len(result) == 1000


@pytest.mark.benchmark
def test_initials_in_email_match(benchmark):
    """Benchmark initials_in_email with matching email."""
    result = benchmark(initials_in_email, "john.smith@example.com", "John Smith")
    assert isinstance(result, bool)


@pytest.mark.benchmark
def test_initials_in_email_no_match(benchmark):
    """Benchmark initials_in_email with non-matching email."""
    result = benchmark(initials_in_email, "alice.wonderland@example.com", "John Smith")
    assert isinstance(result, bool)
