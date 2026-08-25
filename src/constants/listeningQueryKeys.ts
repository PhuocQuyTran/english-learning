import type { UploadStatus } from "@/types/listening";

export const LISTENING_ITEMS_QUERY_KEY = "listening-items";
export interface TranscriptSegment {
  startTime: number;
  endTime: number;
  text: string;
  sequence: number;
}
export const STATUS_LABEL: Record<UploadStatus, string> = {
  idle: "",
  uploading: "Uploading",
  transcribing: "Transcribing",
  ready: "Ready",
  error: "Error",
};
export const TEXT_SIZE_FILE = "File is too large - max 50MB";
