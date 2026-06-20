from sentence_transformers import SentenceTransformer
from disease_loader import load_documents
from chunker import chunk_text
from pathlib import Path
import faiss
import numpy as np
import pickle
import os

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

documents = load_documents()
chunked_documents = []

for doc in documents:

    path = Path(doc["path"])
    chunks = chunk_text(doc["content"])
        
    for chunk in chunks:
        chunked_documents.append({
            "disease": path.parent.name,
            "source": path.name,
            "content": chunk
        })

if len(chunked_documents) == 0:
    raise Exception("No chunks were generated.")
        
texts = [d["content"] for d in chunked_documents]

embeddings = model.encode(
    texts,
    convert_to_numpy=True
)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(np.array(embeddings, dtype=np.float32))

os.makedirs("indexes",exist_ok=True)

faiss.write_index(
    index,
    "indexes/eye_disease.index"
)

with open("indexes/documents.pkl", "wb") as f:
    pickle.dump(
        chunked_documents,
        f
    )

print(f"Indexed {len(chunked_documents)} chunks.")