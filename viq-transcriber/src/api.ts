import axios from "axios";
import { TranscriptSegment } from "./types";

const API_BASE = "http://127.0.0.1:8000";

export interface TranscribeResponse {
  segments: TranscriptSegment[];
  full_text: string;
}

export async function transcribeAudio(file: File): Promise<TranscribeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post<TranscribeResponse>(`${API_BASE}/api/transcribe`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
