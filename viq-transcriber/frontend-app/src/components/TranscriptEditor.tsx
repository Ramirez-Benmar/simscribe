import { useEffect, useState, useRef } from "react";
import type { TranscriptSegment } from "../types";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

interface TranscriptEditorProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  onSegmentsChange: (segments: TranscriptSegment[]) => void;
}

export default function TranscriptEditor({
  segments,
  currentTime,
  onSeek,
  onSegmentsChange,
}: TranscriptEditorProps) {
  const [localSegments, setLocalSegments] = useState<TranscriptSegment[]>(segments);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalSegments(segments);
  }, [segments]);

  const handleLineChange = (index: number, newText: string) => {
    const next = [...localSegments];
    next[index] = { ...next[index], text: newText };
    setLocalSegments(next);
    onSegmentsChange(next);
  };

  const copyToClipboard = async () => {
    const content = localSegments
      .map((s) => `${s.timestamp} SPEAKER: ${s.text}`)
      .join("\n");
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const exportTxt = () => {
    const content = localSegments
      .map((s) => `${s.timestamp} SPEAKER: ${s.text}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "transcript.txt");
  };

  const exportDocx = async () => {
    const paragraphs = localSegments.map(
      (s) =>
        new Paragraph({
          children: [
            new TextRun({
              text: `${s.timestamp} SPEAKER: `,
              bold: true,
            }),
            new TextRun({
              text: s.text,
            }),
          ],
        })
    );

    const doc = new Document({
      sections: [{ children: paragraphs }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "transcript.docx");
  };

  // Auto-resize textarea
  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = "auto";
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex justify-between items-center">
        <div className="text-xs text-slate-400">
          {localSegments.length > 0 && `${localSegments.length} segments`}
        </div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={copyToClipboard}
            disabled={localSegments.length === 0}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy All"}
          </button>
          <button
            onClick={exportTxt}
            disabled={localSegments.length === 0}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Export .txt
          </button>
          <button
            onClick={exportDocx}
            disabled={localSegments.length === 0}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Export .docx
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-y-auto p-6">
        {localSegments.length === 0 && (
          <div className="text-slate-500 text-sm">
            Your transcript will appear here after transcription.
            <div className="mt-2 text-xs">
              <kbd className="px-2 py-1 bg-slate-800 rounded">Space</kbd> to play/pause,{" "}
              <kbd className="px-2 py-1 bg-slate-800 rounded">Ctrl+Enter</kbd> to transcribe
            </div>
          </div>
        )}

        {localSegments.map((seg, idx) => {
          const isActive = currentTime >= seg.start && currentTime < seg.end;
          return (
            <div
              key={seg.id}
              className={`mb-2 rounded-xl px-3 py-2 cursor-pointer transition-colors ${
                isActive ? "bg-slate-700/70" : "bg-transparent hover:bg-slate-800/30"
              }`}
              onClick={() => onSeek(seg.start)}
            >
              <span className="text-xs text-slate-400 mr-3 font-mono select-none">
                {seg.timestamp}
              </span>
              <textarea
                className="w-full bg-transparent border-0 outline-none resize-none text-base leading-relaxed font-mono text-slate-100 overflow-hidden"
                value={seg.text}
                onChange={(e) => handleLineChange(idx, e.target.value)}
                onInput={handleTextareaInput}
                onClick={(e) => e.stopPropagation()}
                rows={1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
