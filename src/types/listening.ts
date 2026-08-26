import { LEVEL_VALUES } from "@/constants";

export const UPLOAD_STATUS = {
  idle: "idle",
  uploading: "uploading",
  transcribing: "transcribing",
  ready: "ready",
  error: "error",
} as const;

export type ListeningLevel = (typeof LEVEL_VALUES)[number];

export interface ListeningItem {
  id: string;
  title: string;
  description?: string | null;
  level?: ListeningLevel | null;
  category?: string | null;
  mediaType?: "audio" | "video" | null;
  durationSeconds: number;
  mediaUrl?: string | null;
  status?: "uploaded" | "processing" | "completed" | "failed";
  created_at?: string;
  updated_at?: string;
}

export type UploadStatus = (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS];

export interface AudioItem {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
}
export interface TranscriptSegment {
  id?: string;
  startTime: number;
  endTime: number;
  text: string;
  sequence: number;
}
export interface Recording {
  id: string;
  blob: Blob;
  url: string;
  durationMs: number;
  score: number | null;
  createdAt: Date;
}
