import { useRef, useEffect, useState } from "react";

interface AudioPlayerBarProps {
  fileUrl?: string;
  onFileSelected: (file: File) => void;
  onTimeUpdate: (time: number) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayerBar({
  fileUrl,
  onFileSelected,
  onTimeUpdate,
  playing,
  setPlaying,
}: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [onTimeUpdate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, setPlaying]);

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || Infinity, audio.currentTime + seconds));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-4">
      <div>
        <label className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700">
          Upload audio
          <input
            type="file"
            accept="audio/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <audio ref={audioRef} src={fileUrl} />

      <div className="flex items-center gap-2 flex-1">
        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          onClick={() => handleSkip(-10)}
          disabled={!fileUrl}
        >
          -10s
        </button>
        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          onClick={() => handleSkip(-5)}
          disabled={!fileUrl}
        >
          -5s
        </button>

        <button
          className="text-xs px-3 py-1 rounded-full bg-indigo-500 hover:bg-indigo-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPlaying(!playing)}
          disabled={!fileUrl}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          onClick={() => handleSkip(5)}
          disabled={!fileUrl}
        >
          +5s
        </button>
        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50"
          onClick={() => handleSkip(10)}
          disabled={!fileUrl}
        >
          +10s
        </button>

        {fileUrl && (
          <div className="text-xs text-slate-400 ml-2 font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>
    </div>
  );
}
