import os
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
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

# Supported audio formats
SUPPORTED_FORMATS = [
    ".mp3", ".wav", ".m4a", ".flac", ".ogg", 
    ".wma", ".aac", ".mp4", ".webm"
]


@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Validate file exists
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file format
    suffix = os.path.splitext(file.filename)[-1].lower()
    if suffix not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(SUPPORTED_FORMATS)}"
        )
    
    # Save uploaded file to a temp path
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        contents = await file.read()
        
        # Check file size (max 500MB)
        if len(contents) > 500 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size: 500MB")
        
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        result = transcriber.transcribe(tmp_path)
    except Exception as e:
        # Clean up temp file on error
        try:
            os.remove(tmp_path)
        except OSError:
            pass
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")
    finally:
        # clean up
        try:
            os.remove(tmp_path)
        except OSError:
            pass

    return result
