"""
Performance benchmarks for the grant matching algorithms.
"""
import pytest
import numpy as np
from app.utils.utils import clean_text


@pytest.mark.benchmark
def test_text_cleaning_pipeline(benchmark):
    """Benchmark the complete text cleaning pipeline for matching."""
    grant_texts = [
        "Research Grant for Machine Learning in Healthcare Applications",
        "Funding Opportunity: Advanced AI and Neural Network Development",
        "Grant for Climate Change Research and Environmental Science",
        "Biomedical Research: Cancer Treatment and Drug Discovery",
        "Quantum Computing and Cryptography Research Grant"
    ] * 10
    
    def process_texts():
        return [clean_text(text) for text in grant_texts]
    
    result = benchmark(process_texts)
    assert len(result) == 50


@pytest.mark.benchmark
def test_cosine_similarity_computation(benchmark):
    """Benchmark cosine similarity computation between embeddings."""
    # Simulate embeddings
    researcher_vec = np.random.rand(384)  # Typical sentence transformer embedding size
    grant_vecs = np.random.rand(100, 384)
    
    # Normalize
    researcher_vec = researcher_vec / np.linalg.norm(researcher_vec)
    grant_vecs = grant_vecs / np.linalg.norm(grant_vecs, axis=1, keepdims=True)
    
    def compute_similarities():
        return np.dot(grant_vecs, researcher_vec)
    
    result = benchmark(compute_similarities)
    assert len(result) == 100


@pytest.mark.benchmark
def test_top_k_filtering(benchmark):
    """Benchmark filtering top matches based on similarity threshold."""
    scores = np.random.rand(1000)
    threshold = 0.35
    
    def filter_matches():
        return [i for i, score in enumerate(scores) if score >= threshold]
    
    result = benchmark(filter_matches)
    assert isinstance(result, list)


@pytest.mark.benchmark
def test_batch_preparation(benchmark):
    """Benchmark preparation of batch inputs for LLM processing."""
    researcher_keywords = "machine learning, deep learning, neural networks"
    grant_descriptions = [
        f"Grant {i}: Research in AI and ML applications in domain {i}"
        for i in range(50)
    ]
    
    def prepare_batches():
        return [
            {
                "interests": researcher_keywords,
                "description": desc
            }
            for desc in grant_descriptions
        ]
    
    result = benchmark(prepare_batches)
    assert len(result) == 50


@pytest.mark.benchmark
def test_fingerprint_set_operations(benchmark):
    """Benchmark set operations for duplicate detection."""
    # Simulate existing fingerprints
    existing_fingerprints = {f"fingerprint_{i}" for i in range(1000)}
    new_fingerprints = [f"fingerprint_{i}" for i in range(500, 1500)]
    
    def check_duplicates():
        unique = []
        for fp in new_fingerprints:
            if fp not in existing_fingerprints:
                unique.append(fp)
        return unique
    
    result = benchmark(check_duplicates)
    assert len(result) == 500  # 500 new fingerprints (1000-1500)


@pytest.mark.benchmark
def test_text_concatenation(benchmark):
    """Benchmark text concatenation for grant matching."""
    titles = ["Grant Title " + str(i) for i in range(100)]
    descriptions = ["This is a detailed description for grant " + str(i) for i in range(100)]
    
    def concatenate_texts():
        return [t + "\n" + d for t, d in zip(titles, descriptions)]
    
    result = benchmark(concatenate_texts)
    assert len(result) == 100
