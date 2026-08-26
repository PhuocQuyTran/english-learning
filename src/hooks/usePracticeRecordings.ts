import { useState } from "react";
import type { Recording } from "@/types/listening";

type RecordingsMap = Record<number, Recording[]>;

export function usePracticeRecordings() {
  const [recordingsMap, setRecordingsMap] = useState<RecordingsMap>({});

  const addRecording = (segmentSequence: number, recording: Recording) => {
    setRecordingsMap((prev) => ({
      ...prev,
      [segmentSequence]: [recording, ...(prev[segmentSequence] ?? [])],
    }));
  };

  const deleteRecording = (segmentSequence: number, recordingId: string) => {
    setRecordingsMap((prev) => {
      const list = prev[segmentSequence] ?? [];
      const target = list.find((r) => r.id === recordingId);
      if (target) URL.revokeObjectURL(target.url);
      return {
        ...prev,
        [segmentSequence]: list.filter((r) => r.id !== recordingId),
      };
    });
  };

  const updateScore = (
    segmentSequence: number,
    recordingId: string,
    score: number,
  ) => {
    setRecordingsMap((prev) => ({
      ...prev,
      [segmentSequence]: (prev[segmentSequence] ?? []).map((r) =>
        r.id === recordingId ? { ...r, score } : r,
      ),
    }));
  };

  const getRecordings = (segmentSequence: number): Recording[] =>
    recordingsMap[segmentSequence] ?? [];

  const getBest = (segmentSequence: number): Recording | null => {
    const list = recordingsMap[segmentSequence] ?? [];
    if (list.length === 0) return null;
    return list.reduce((best, r) =>
      (r.score ?? 0) > (best.score ?? 0) ? r : best,
    );
  };

  return { getRecordings, getBest, addRecording, deleteRecording, updateScore };
}
