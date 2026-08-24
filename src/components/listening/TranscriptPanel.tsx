import { cn } from "@/lib/utils";
import type { TranscriptSegment } from "@/constants/listeningQueryKeys";
import { Button } from "../ui/button";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function TranscriptPanel({
  segments,
  activeIndex,
  onSelect,
}: TranscriptPanelProps) {
  console.log(segments);
  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Transcript</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-[#8B949E]">
          Auto-generated
        </span>
      </div>

      <div className="space-y-3">
        {segments.map((segment, index) => {
          const isActive = index === activeIndex;

          return (
            <Button
              key={`${segment.sequence}-${segment.startTime}`}
              type="button"
              onClick={() => onSelect(index)}
              className={cn(
                "w-full rounded border text-left! transition-colors",
                isActive
                  ? "border-[#3FB950] bg-[#3FB950]/10 text-[#E6EDF3]"
                  : "border-white/10 bg-[#0D1117] text-[#C9D1D9] hover:border-[#8B949E]",
              )}
            >
              <div className="mb-1 flex w-full items-center justify-between text-xs text-[#8B949E]">
                <span>
                  {segment.startTime.toFixed(1)}s - {segment.endTime.toFixed(1)}
                  s
                </span>

                <span>{segment.sequence}</span>
              </div>
              <p>{segment.text}</p>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
