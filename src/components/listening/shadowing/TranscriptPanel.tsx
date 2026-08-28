import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TranscriptSegment } from "@/types/listening";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/vocabulary/AudioPlayer";
import { SegmentText } from "./SegmentText";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  activeIndex: number;
  audioItemId: string;
  level?: string;
  onSelect: (index: number) => void;
  onOpenShadowing?: (index: number) => void;
}

export function TranscriptPanel({
  segments,
  activeIndex,
  audioItemId,
  level,
  onSelect,
  onOpenShadowing,
}: TranscriptPanelProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#161B22] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Transcript</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-[#8B949E]">
          Auto-generated
        </span>
      </div>

      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-2">
        {segments.map((segment, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={`${segment.sequence}-${segment.startTime}`}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if ((e.nativeEvent as any).isWordClick) return;
                onSelect(index);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(index);
              }}
              className={cn(
                "w-full cursor-pointer rounded border px-4 py-3 text-left transition-colors focus:outline-none",
                isActive
                  ? "border-[#3FB950] bg-[#3FB950]/10 text-[#E6EDF3]"
                  : "border-white/10 bg-[#0D1117] text-[#C9D1D9] hover:border-[#8B949E]",
              )}
            >
              <div className="mb-2 flex items-center justify-between font-mono text-xs text-[#8B949E]">
                <span>
                  {formatTime(segment.startTime)} –{" "}
                  {formatTime(segment.endTime)}
                </span>
                <span className={isActive ? "text-[#3FB950]" : ""}>
                  #{segment.sequence}
                </span>
              </div>

              <div className="mb-3">
                <SegmentText
                  text={segment.text}
                  audioItemId={audioItemId}
                  level={level}
                />
              </div>

              <div
                className="flex items-center justify-between gap-2 border-t border-white/5 pt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <AudioPlayer word={segment.text} />

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShadowing?.(index);
                  }}
                  className="h-8 gap-1.5 border-white/10 bg-transparent text-xs text-[#8B949E] hover:border-[#3FB950] hover:text-[#3FB950]"
                >
                  <Mic className="h-3.5 w-3.5" />
                  Shadowing
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
