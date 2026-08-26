import { WavesIcon } from "lucide-react";
import { WaveformStatic } from "./WaveFormStatic";
import type { Recording } from "@/types/listening";
import {
  PracticeScoreLevel,
  SCORE_LEVEL_CONFIG,
} from "@/constants/listeningQueryKeys";

export function getScoreConfig(score: number) {
  if (score >= SCORE_LEVEL_CONFIG[PracticeScoreLevel.GREAT].minScore) {
    return SCORE_LEVEL_CONFIG[PracticeScoreLevel.GREAT];
  }
  if (score >= SCORE_LEVEL_CONFIG[PracticeScoreLevel.CLOSER].minScore) {
    return SCORE_LEVEL_CONFIG[PracticeScoreLevel.CLOSER];
  }
  return SCORE_LEVEL_CONFIG[PracticeScoreLevel.POOR];
}

interface CompareBlockProps {
  segmentSequence: number;
  bestRecording: Recording | null;
}

export function CompareBlock({
  segmentSequence,
  bestRecording,
}: CompareBlockProps) {
  if (!bestRecording) return null;

  const score = bestRecording.score ?? 0;
  const { label, color: barColor } = getScoreConfig(score);

  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#8B949E]">
        <WavesIcon className="h-3.5 w-3.5" />
        Compare
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium text-[#8B949E]">
            Original
          </span>
          <div className="overflow-hidden rounded-md bg-[#0D1117] p-1.5">
            <WaveformStatic
              seed={`orig-${segmentSequence}`}
              barCount={28}
              color="#378add"
              height={28}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-medium text-[#8B949E]">
            Your best
          </span>
          <div className="overflow-hidden rounded-md bg-[#0D1117] p-1.5">
            <WaveformStatic
              seed={bestRecording.id}
              barCount={28}
              color="#3FB950"
              height={28}
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, backgroundColor: barColor }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs text-[#8B949E]">
          <span>{label}</span>
          <span
            className="tabular-nums font-medium"
            style={{ color: barColor }}
          >
            {score}%
          </span>
        </div>
      </div>
    </div>
  );
}
