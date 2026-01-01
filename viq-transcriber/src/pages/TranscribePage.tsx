import { useState, useCallback } from "react";
import AudioPlayerBar from "../components/AudioPlayerBar";
import TranscriptEditor from "../components/TranscriptEditor";
import { TranscriptSegment } from "../types";
import { transcribeAudio } from "../api";

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>();
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileSelected = (f: File) => {
    setFile(f);
    setSegments([]);
    setCurrentTime(0);
    setPlaying(false);

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(f);
    setFileUrl(url);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const result = await transcribeAudio(file);
      setSegments(result.segments);
    } catch (err) {
      console.error(err);
      alert("Transcription failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeek = useCallback(
    (time: number) => {
      const audio = document.querySelector("audio");
      if (!audio) return;
      audio.currentTime = time;
    },
    []
  );

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <AudioPlayerBar
            fileUrl={fileUrl}
            onFileSelected={handleFileSelected}
            onTimeUpdate={setCurrentTime}
            playing={playing}
            setPlaying={setPlaying}
          />
        </div>
        <button
          onClick={handleTranscribe}
          disabled={!file || loading}
          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 text-sm font-medium"
        >
          {loading ? "Transcribing…" : "Transcribe"}
        </button>
      </div>

      <div className="flex-1">
        <TranscriptEditor
          segments={segments}
          currentTime={currentTime}
          onSeek={handleSeek}
          onSegmentsChange={setSegments}
        />
      </div>
    </div>
  );
}
