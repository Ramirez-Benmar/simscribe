# Simscribe - Audio Transcription App

A modern web application for transcribing audio files using OpenAI's Whisper model. Built with React, TypeScript, FastAPI, and Tailwind CSS.

## Features

- 🎙️ **Audio Transcription**: Upload audio/video files and get accurate transcriptions using Whisper AI
- ⏯️ **Audio Playback**: Built-in audio player with skip controls (+/- 5s, 10s)
- ✏️ **Edit Transcripts**: Click on any segment to jump to that timestamp, edit text inline
- 💾 **Export Options**: Export transcripts as `.txt` or `.docx` files
- 📋 **Copy to Clipboard**: Quickly copy entire transcript with one click
- ⌨️ **Keyboard Shortcuts**: 
  - `Space` - Play/pause audio
  - `Ctrl+Enter` - Start transcription
- 🎨 **Modern UI**: Clean, dark-themed interface with smooth transitions

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **docx** - DOCX file generation
- **file-saver** - File download utility

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI Whisper** - State-of-the-art speech recognition
- **PyTorch** - Deep learning framework
- **Uvicorn** - ASGI server

## Installation

### Prerequisites
- **Node.js** 20+ and npm
- **Python** 3.8+
- **FFmpeg** (for audio processing)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd viq-transcriber/backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd viq-transcriber/frontend-app
```

2. Install npm dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Start both servers** (backend and frontend)
2. **Open the app** in your browser at `http://localhost:5173`
3. **Navigate to Transcribe page**
4. **Upload an audio file** (supports .mp3, .wav, .m4a, .flac, .ogg, .aac, .mp4, .webm)
5. **Click Transcribe** or press `Ctrl+Enter`
6. **Wait for processing** (duration depends on file length)
7. **Edit the transcript** by clicking on any segment
8. **Export** as .txt or .docx when finished

## Project Structure

```
viq-transcriber/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── viq_transcriber.py   # Whisper transcription logic
│   └── requirements.txt     # Python dependencies
│
└── frontend-app/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── AudioPlayerBar.tsx
    │   │   ├── TranscriptEditor.tsx
    │   │   └── ProjectCard.tsx
    │   ├── pages/           # Page components
    │   │   ├── Landingpage.tsx
    │   │   ├── TranscribePage.tsx
    │   │   └── SettingsPage.tsx
    │   ├── api.ts           # API client
    │   ├── types.ts         # TypeScript types
    │   └── App.tsx          # Main app component
    ├── package.json
    └── vite.config.ts
```

## API Endpoints

### POST `/api/transcribe`
Upload an audio file for transcription.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (audio file)

**Response:**
```json
{
  "segments": [
    {
      "id": 0,
      "start": 0.0,
      "end": 3.5,
      "timestamp": "00:00:00",
      "text": "Hello, this is a sample transcription."
    }
  ],
  "full_text": "00:00:00 SPEAKER: Hello, this is a sample transcription."
}
```

**Error Responses:**
- `400` - Invalid file format or file too large (max 500MB)
- `500` - Transcription failed

## Configuration

### Whisper Model Size
You can change the Whisper model size in [backend/main.py](backend/main.py):

```python
transcriber = VIQTranscriber(model_name="small")
```

Available models:
- `tiny` - Fastest, least accurate (~1GB RAM)
- `base` - Fast (~1GB RAM)
- `small` - **Default** - Good balance (~2GB RAM)
- `medium` - More accurate (~5GB RAM)
- `large` - Most accurate, slowest (~10GB RAM)

### Supported Audio Formats
- MP3, WAV, M4A, FLAC, OGG, WMA, AAC, MP4, WEBM

### File Size Limit
Maximum upload size: **500MB** (configurable in [backend/main.py](backend/main.py))

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/pause audio |
| `Ctrl+Enter` | Start transcription |

## Troubleshooting

### Backend Issues
- **"Module not found" errors**: Make sure you've activated the virtual environment and installed all dependencies
- **CUDA errors**: Whisper will automatically fall back to CPU if GPU is unavailable
- **FFmpeg not found**: Install FFmpeg from https://ffmpeg.org/

### Frontend Issues
- **API connection errors**: Ensure the backend is running on `http://127.0.0.1:8000`
- **Build errors**: Try deleting `node_modules` and running `npm install` again

### Performance
- Transcription time varies by:
  - Audio file length
  - Whisper model size
  - CPU/GPU performance
- Expect ~1-5 minutes for a 30-minute audio file on CPU with the `small` model

## Future Enhancements

- [ ] Multiple speaker detection and labeling
- [ ] Real-time transcription
- [ ] Support for multiple languages
- [ ] Cloud storage integration
- [ ] Batch processing
- [ ] Advanced search in transcripts
- [ ] Custom vocabulary/terminology

## License

MIT License

## Credits

- Built with [OpenAI Whisper](https://github.com/openai/whisper)
- UI inspired by modern transcription tools
