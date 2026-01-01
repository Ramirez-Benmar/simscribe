import { useRef, useEffect } from "react";

interface AudioPlayerBarProps {
  fileUrl?: string;
  onFileSelected: (file: File) => void;
  onTimeUpdate: (time: number) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

export default function AudioPlayerBar({
  fileUrl,
  onFileSelected,
  onTimeUpdate,
  playing,
  setPlaying,
}: AudioPlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handler = () => {
      onTimeUpdate(audio.currentTime);
    };
    audio.addEventListener("timeupdate", handler);
    return () => audio.removeEventListener("timeupdate", handler);
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
    if (file) onFileSelected(file);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-4">
      <div>
        <label className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700">
          Upload audio
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <audio ref={audioRef} src={fileUrl} />

      <div className="flex items-center gap-2 flex-1">
        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
          onClick={() => handleSkip(-10)}
        >
          -10s
        </button>
        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
          onClick={() => handleSkip(-5)}
        >
          -5s
        </button>

        <button
          className="text-xs px-3 py-1 rounded-full bg-indigo-500 hover:bg-indigo-400 font-medium"
          onClick={() => setPlaying(!playing)}
          disabled={!fileUrl}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
          onClick={() => handleSkip(5)}
        >
          +5s
        </button>
        <button
          className="text-xs px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
          onClick={() => handleSkip(10)}
        >
          +10s
        </button>
      </div>
    </div>
  );
}
