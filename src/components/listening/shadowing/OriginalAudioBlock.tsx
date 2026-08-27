import { useRef, useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import { WaveformStatic } from "./WaveFormStatic";
import type { TranscriptSegment } from "@/types/listening";
import { formatSeconds } from "@/utils/duration";
import { AudioPlayer } from "@/components/vocabulary/AudioPlayer";

interface OriginalAudioBlockProps {
  segment: TranscriptSegment;
  audioSrc?: string;
}

export function OriginalAudioBlock({
  segment,
  audioSrc,
}: OriginalAudioBlockProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = segment.endTime - segment.startTime;

  useEffect(() => {
    let animationFrame: number;
    let startTime: number;

    if (playing) {
      startTime = Date.now();
      setProgress(0);

      const updateProgress = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed < duration) {
          setProgress(elapsed / duration);
          animationFrame = requestAnimationFrame(updateProgress);
        } else {
          setProgress(1);
        }
      };

      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      setProgress(0);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [playing, duration]);

  const handleTimeUpdate = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.currentTime >= segment.endTime) {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
        />
      )}

      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#8B949E]">
        <Volume2 className="h-3.5 w-3.5" />
        Original
      </div>

      <p className="mb-4 text-[15px] leading-relaxed text-[#E6EDF3]">
        {segment.text}
      </p>

      <div className="flex items-center gap-3">
        <AudioPlayer word={segment.text} onPlayStateChange={setPlaying} />
        <div className="min-w-0 flex-1 overflow-hidden rounded-md">
          <WaveformStatic
            seed={`orig-${segment.sequence}`}
            color="#378add"
            height={28}
            progress={progress}
          />
        </div>

        <span className="shrink-0 text-xs tabular-nums text-[#8B949E]">
          {formatSeconds(duration)}
        </span>
      </div>
    </div>
  );
}
