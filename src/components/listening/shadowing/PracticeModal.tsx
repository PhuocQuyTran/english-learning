import { useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { OriginalAudioBlock } from "./OriginalAudioBlock";
import { RecordBlock } from "./RecordingBlock";
import { CompareBlock } from "./CompareBlock";
import { usePracticeRecordings } from "@/hooks/usePracticeRecordings";
import type { Recording, TranscriptSegment } from "@/types/listening";
import { formatSegmentTime } from "@/utils/duration";
import { Button } from "@/components/ui/button";

interface PracticeModalProps {
  segments: TranscriptSegment[];
  currentIndex: number;
  audioSrc?: string;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export function PracticeModal({
  segments,
  currentIndex,
  audioSrc,
  onNavigate,
  onClose,
}: PracticeModalProps) {
  const segment = segments[currentIndex];
  const { getRecordings, getBest, addRecording, deleteRecording } =
    usePracticeRecordings();

  const recordings = getRecordings(segment.sequence);
  const best = getBest(segment.sequence);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0)
        onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < segments.length - 1)
        onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNavigate, currentIndex, segments.length]);

  const handleRecorded = useCallback(
    (r: Recording) => {
      addRecording(segment.sequence, r);
    },
    [addRecording, segment.sequence],
  );

  const handleDelete = useCallback(
    (id: string) => deleteRecording(segment.sequence, id),
    [deleteRecording, segment.sequence],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Practice segment ${segment.sequence}`}
        className="flex w-full max-w-2xl flex-col rounded-t-2xl border border-white/10 bg-[#0D1117] pb-6"
        style={{ maxHeight: "92dvh" }}
      >
        <div className="mx-auto mt-3 h-1 w-9 rounded-full bg-white/20" />
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-[15px] font-medium text-[#E6EDF3]">
              Segment #{segment.sequence} — Practice
            </h2>
            <p className="mt-0.5 text-xs text-[#8B949E]">
              {formatSegmentTime(segment.startTime)} –{" "}
              {formatSegmentTime(segment.endTime)}
            </p>
          </div>
          <Button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#161B22]"
          >
            <X className="h-3.5 w-3.5 text-[#8B949E]" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-3">
            <OriginalAudioBlock segment={segment} audioSrc={audioSrc} />

            <RecordBlock
              segmentSequence={segment.sequence}
              recordings={recordings}
              bestId={best?.id ?? null}
              onRecorded={handleRecorded}
              onDelete={handleDelete}
            />

            <CompareBlock
              segmentSequence={segment.sequence}
              bestRecording={best}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 px-5 pt-4">
          <Button
            onClick={() => onNavigate(currentIndex - 1)}
            variant="outline"
            disabled={currentIndex === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs text-[#8B949E] hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>

          <span className="shrink-0 text-xs tabular-nums text-[#8B949E]">
            {currentIndex + 1} / {segments.length}
          </span>

          <Button
            onClick={() => onNavigate(currentIndex + 1)}
            variant="outline"
            disabled={currentIndex === segments.length - 1}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs text-[#8B949E] hover:bg-white/5 disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
