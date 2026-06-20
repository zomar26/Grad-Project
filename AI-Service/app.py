from fastapi import FastAPI, UploadFile, File
from sentence_transformers import SentenceTransformer
from faster_whisper import WhisperModel
from search import search
import shutil
import os

app = FastAPI()

embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

whisper_model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

@app.get("/")
def root():
    return {
        "status": "running"
    }

@app.post("/embed")
async def embed(data: dict):

    text = data["text"]

    embedding = embedding_model.encode(text)

    return {
        "vector": embedding.tolist()
    }

@app.post("/search")
async def semantic_search(data: dict):

    query = data["query"]

    results = search(query)

    return {
        "results": results
    }

@app.post("/transcribe")
async def transcribe(
    audio: UploadFile = File(...)
):

    temp_path = f"temp_{audio.filename}"

    with open(
        temp_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            audio.file,
            buffer
        )

    segments, info = whisper_model.transcribe(
        temp_path
    )

    transcript = " ".join(
        segment.text
        for segment in segments
    )

    os.remove(
        temp_path
    )

    return {
        "transcript": transcript
    }