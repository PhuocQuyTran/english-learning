import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SegmentNavigationProps {
  activeSegmentIndex: number;
  totalSegments: number;
  onPrev: () => void;
  onNext: () => void;
}

export function SegmentNavigation({
  activeSegmentIndex,
  totalSegments,
  onPrev,
  onNext,
}: SegmentNavigationProps) {
  if (totalSegments === 0) return null;

  return (
    <div className="flex gap-2 justify-between mb-6 bg-[#161B22] p-2 rounded-xl border border-white/10">
      <Button
        variant="ghost"
        onClick={onPrev}
        disabled={activeSegmentIndex === 0}
        className="flex-1 hover:bg-[#21262D] text-[#C9D1D9]"
      >
        <ChevronLeft className="h-5 w-5 mr-1" /> Previous Segment
      </Button>
      <div className="w-px bg-white/10" />
      <Button
        variant="ghost"
        onClick={onNext}
        disabled={activeSegmentIndex === totalSegments - 1}
        className="flex-1 hover:bg-[#21262D] text-[#C9D1D9]"
      >
        Next Segment <ChevronRight className="h-5 w-5 ml-1" />
      </Button>
    </div>
  );
}
