import { type RefObject, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react";
import { formatDuration } from "@/utils/duration";
import { STORAGE_KEY } from "@/constants";
import { PLAYBACK_RATES } from "@/constants/listeningQueryKeys";
import { AppSelect } from "@/components/ui/appSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BottomPlayerBarProps {
  mediaRef: RefObject<HTMLMediaElement | HTMLAudioElement | null>;
  currentTime: number;
  duration: number;
}

export function BottomPlayerBar({
  mediaRef,
  currentTime,
  duration,
}: BottomPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    media.addEventListener("play", handlePlay);
    media.addEventListener("pause", handlePause);

    return () => {
      media.removeEventListener("play", handlePlay);
      media.removeEventListener("pause", handlePause);
    };
  }, [mediaRef]);

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, mediaRef]);

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play().catch(console.warn);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
    }
  };

  const skipSeconds = (seconds: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = Math.max(
        0,
        Math.min(mediaRef.current.currentTime + seconds, duration),
      );
    }
  };
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0D1117]/95 px-6 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2">
        <div className="flex w-full items-center gap-3 text-xs text-[#8B949E]">
          <span>{formatDuration(currentTime)}</span>
          <div className="relative flex-1">
            <Input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer rounded-lg bg-[#21262D] accent-[#3FB950]"
              style={{
                background: `linear-gradient(to right, #3FB950 ${progressPercent}%, #21262D ${progressPercent}%)`,
              }}
            />
          </div>
          <span>{formatDuration(duration)}</span>
        </div>

        <div className="flex w-full items-center justify-between">
          <AppSelect
            value={playbackRate.toString()}
            onChange={(val) => {
              setPlaybackRate(parseFloat(val));
              localStorage.setItem(STORAGE_KEY, val);
            }}
            options={PLAYBACK_RATES.map((rate) => {
              return {
                value: rate.toString(),
                label: `${rate.toFixed(1)}x`,
              };
            })}
            className="w-[80px]"
          />

          <div className="flex items-center gap-5">
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => skipSeconds(-5)}
              className="relative p-2 text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
              title="Seek back 5s"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                5
              </span>
            </Button>

            <Button
              type="button"
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3FB950] text-[#0D1117] shadow-[0_0_15px_rgba(63,185,80,0.4)] transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="h-6 w-6 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              type="button"
              onClick={() => skipSeconds(5)}
              className="relative p-2 text-[#8B949E] hover:text-[#E6EDF3] transition-colors"
              title="Seek forward 5s"
              variant={"ghost"}
            >
              <RotateCw className="h-5 w-5" />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold">
                5
              </span>
            </Button>
          </div>

          <div className="w-[50px]"></div>
        </div>
      </div>
    </div>
  );
}
