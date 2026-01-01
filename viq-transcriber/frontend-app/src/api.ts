import axios from "axios";
import type { TranscriptSegment } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface TranscribeResponse {
  segments: TranscriptSegment[];
  full_text: string;
}

export async function transcribeAudio(file: File): Promise<TranscribeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post<TranscribeResponse>(
    `${API_BASE}/api/transcribe`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}
