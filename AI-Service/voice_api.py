from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import shutil
import os

app = FastAPI()

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

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

    segments, info = model.transcribe(
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
        "transcript":
        transcript
    }