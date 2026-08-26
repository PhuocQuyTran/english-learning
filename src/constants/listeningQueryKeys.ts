import type { UploadStatus } from "@/types/listening";

export const LISTENING_ITEMS_QUERY_KEY = "listening-items";
export const STATUS_LABEL: Record<UploadStatus, string> = {
  idle: "",
  uploading: "Uploading",
  transcribing: "Transcribing",
  ready: "Ready",
  error: "Error",
};
export const TEXT_SIZE_FILE = "File is too large - max 50MB";
export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
export const PracticeScoreLevel = {
  GREAT: "GREAT" as const,
  CLOSER: "CLOSER" as const,
  POOR: "POOR" as const,
};

type PracticeScoreLevel =
  (typeof PracticeScoreLevel)[keyof typeof PracticeScoreLevel];

export const SCORE_LEVEL_CONFIG: Record<
  PracticeScoreLevel,
  { label: string; color: string; minScore: number }
> = {
  [PracticeScoreLevel.GREAT]: {
    label: "Great match!",
    color: "#3FB950",
    minScore: 85,
  },
  [PracticeScoreLevel.CLOSER]: {
    label: "Getting closer",
    color: "#eab308",
    minScore: 70,
  },
  [PracticeScoreLevel.POOR]: {
    label: "Keep practicing",
    color: "#e24b4a",
    minScore: 0,
  },
};
