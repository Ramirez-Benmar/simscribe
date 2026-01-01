import { useEffect, useState } from "react";
import { TranscriptSegment } from "../types";
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

  useEffect(() => {
    setLocalSegments(segments);
  }, [segments]);

  const handleLineChange = (index: number, newText: string) => {
    const next = [...localSegments];
    next[index] = { ...next[index], text: newText };
    setLocalSegments(next);
    onSegmentsChange(next);
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

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex justify-end gap-2 text-xs">
        <button
          onClick={exportTxt}
          className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
        >
          Export .txt
        </button>
        <button
          onClick={exportDocx}
          className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700"
        >
          Export .docx
        </button>
      </div>

      <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 overflow-y-auto p-6">
        {localSegments.length === 0 && (
          <div className="text-slate-500 text-sm">
            Your transcript will appear here after transcription.
          </div>
        )}

        {localSegments.map((seg, idx) => {
          const isActive = currentTime >= seg.start && currentTime < seg.end;
          return (
            <div
              key={seg.id}
              className={`mb-2 rounded-xl px-3 py-2 cursor-text transition-colors ${
                isActive ? "bg-slate-700/70" : "bg-transparent"
              }`}
              onClick={() => onSeek(seg.start)}
            >
              <span className="text-xs text-slate-400 mr-3 font-mono">
                {seg.timestamp}
              </span>
              <textarea
                className="w-full bg-transparent border-0 outline-none resize-none text-lg leading-relaxed font-mono text-slate-100"
                value={seg.text}
                onChange={(e) => handleLineChange(idx, e.target.value)}
                rows={1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
