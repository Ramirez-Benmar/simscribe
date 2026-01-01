import { useState, useCallback, useEffect } from "react";
import AudioPlayerBar from "../components/AudioPlayerBar";
import TranscriptEditor from "../components/TranscriptEditor";
import type { TranscriptSegment } from "../types";
import { transcribeAudio } from "../api";

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>();
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleFileSelected = (f: File) => {
    setFile(f);
    setSegments([]);
    setCurrentTime(0);
    setPlaying(false);
    setError("");

    if (fileUrl) URL.revokeObjectURL(fileUrl);
    const url = URL.createObjectURL(f);
    setFileUrl(url);
  };

  const handleTranscribe = async () => {
    if (!file) return;
    try {
      setLoading(true);
      setError("");
      const result = await transcribeAudio(file);
      setSegments(result.segments);
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.detail || err.message || "Transcription failed";
      setError(`Error: ${errorMsg}. Make sure the backend server is running on http://127.0.0.1:8000`);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space bar to play/pause
      if (e.code === "Space" && fileUrl && e.target === document.body) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      // Ctrl/Cmd + Enter to transcribe
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && file && !loading) {
        e.preventDefault();
        handleTranscribe();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fileUrl, file, loading]);

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
          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          title="Ctrl+Enter to transcribe"
        >
          {loading ? "Transcribing…" : "Transcribe"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center text-sm text-slate-400 py-4">
          Processing audio... This may take a few minutes depending on file length.
        </div>
      )}

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
