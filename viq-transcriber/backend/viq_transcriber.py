import whisper
from typing import List, Dict, Optional


def seconds_to_hhmmss(seconds: float) -> str:
    """Convert seconds to HH:MM:SS timestamp format."""
    total_seconds = int(round(seconds))
    h = total_seconds // 3600
    m = (total_seconds % 3600) // 60
    s = total_seconds % 60
    return f"{h:02d}:{m:02d}:{s:02d}"


class VIQTranscriber:
    """Audio transcription using OpenAI Whisper."""
    
    def __init__(self, model_name: str = "small"):
        """Initialize the transcriber with a Whisper model.
        
        Args:
            model_name: Whisper model size (tiny, base, small, medium, large)
        """
        self.model = whisper.load_model(model_name)

    def transcribe(self, audio_path: str, language: Optional[str] = "en") -> Dict:
        """Transcribe an audio file.
        
        Args:
            audio_path: Path to the audio file
            language: Language code (e.g., "en" for English, None for auto-detect)
        
        Returns:
            Dict containing segments and full_text
        """
        result = self.model.transcribe(
            audio_path,
            language=language,
            verbose=False,
            word_timestamps=False,
        )

        segments = []
        lines = []

        for idx, seg in enumerate(result.get("segments", [])):
            start = float(seg.get("start", 0.0))
            end = float(seg.get("end", start))
            raw_text = (seg.get("text") or "").strip()

            if not raw_text:
                raw_text = "(INAUDIBLE)"

            # Clean leading junk punctuation
            while raw_text and raw_text[0] in ["-", ".", ",", ":", ";", " "]:
                raw_text = raw_text[1:].lstrip()

            # Capitalize first letter if lowercase
            if raw_text and raw_text[0].islower():
                raw_text = raw_text[0].upper() + raw_text[1:]

            ts = seconds_to_hhmmss(start)
            line = f"{ts} SPEAKER: {raw_text}"

            segments.append(
                {
                    "id": idx,
                    "start": start,
                    "end": end,
                    "timestamp": ts,
                    "text": raw_text,
                }
            )
            lines.append(line)

        full_text = "\n".join(lines)

        return {
            "segments": segments,
            "full_text": full_text,
        }
