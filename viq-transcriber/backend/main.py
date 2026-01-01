import os
import tempfile

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from viq_transcriber import VIQTranscriber

app = FastAPI()

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

transcriber = VIQTranscriber(model_name="small")


@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save uploaded file to a temp path
    suffix = os.path.splitext(file.filename)[-1] or ".mp3"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        result = transcriber.transcribe(tmp_path)
    finally:
        # clean up
        try:
            os.remove(tmp_path)
        except OSError:
            pass

    return result
