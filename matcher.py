from scipy.spatial.distance import cosine

def calculate_similarity(vector_a: list, vector_b: list) -> float:
    """
    Calculates cosine similarity between two numeric feature vectors.
    Returns a score from 0.0 (completely different) to 1.0 (identical pictures).
    """
    try:
        cosine_distance = cosine(vector_a, vector_b)
        similarity = 1.0 - cosine_distance
        
        return max(0.0, float(similarity))
    except Exception:
        return 0.0