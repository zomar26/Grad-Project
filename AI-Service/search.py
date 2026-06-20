from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import pickle

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
index = faiss.read_index("indexes/eye_disease.index")

with open("indexes/documents.pkl","rb") as f:
    documents = pickle.load(f)


def search(query,top_k=3):
    query_embedding = model.encode([query])

    distances, indices = index.search(
        np.array(query_embedding, dtype=np.float32),top_k
    )

    results = []

    for idx, distance in zip(
        indices[0],
        distances[0]
    ):
        if idx < len(documents):
            results.append({
                "disease": documents[idx]["disease"],
                "source": documents[idx]["source"],
                "distance": float(distance),
                "content": documents[idx]["content"]
            })

    results = sorted(
        results,
        key=lambda x: x["distance"]
    )

    query_lower = query.lower()

    if "cause" in query_lower:
        results.sort(
            key=lambda x: (
                x["source"] != "causes.md",
                x["distance"]
            )
        )

    elif "symptom" in query_lower:
        results.sort(
            key=lambda x: (
                x["source"] != "symptoms.md",
                x["distance"]
            )
        )

    elif "treat" in query_lower:
        results.sort(
            key=lambda x: (
                x["source"] != "treatment.md",
                x["distance"]
            )
        )

    elif "daily" in query_lower:
        results.sort(
            key=lambda x: (
                x["source"] != "daily_life.md",
                x["distance"]
            )
        )

    elif "overview" in query_lower:
        results.sort(
            key=lambda x: (
                x["source"] != "overview.md",
                x["distance"]
            )
        )
    
    if not results:
        return []

    return results