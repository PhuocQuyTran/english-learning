import { type RefObject, useState, useEffect } from "react";
import { AudioPlayer } from "@/components/vocabulary/AudioPlayer";
import { STORAGE_KEY } from "@/constants";

interface ListeningMediaPlayerProps {
  mediaType?: "video" | "audio" | string;
  mediaUrl?: string | null;
  mediaRef: RefObject<HTMLMediaElement | HTMLAudioElement | null>;
  onTimeUpdate: (time: number) => void;
}

export function ListeningMediaPlayer({
  mediaType,
  mediaUrl,
  mediaRef,
  onTimeUpdate,
}: ListeningMediaPlayerProps) {
  const [playbackRate, setPlaybackRate] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, mediaRef, mediaUrl]);

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      mediaRef.current.playbackRate = playbackRate;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl bg-black shadow-xl shadow-black/50">
        {mediaType === "video" ? (
          <video
            ref={mediaRef as RefObject<HTMLVideoElement>}
            controls
            src={mediaUrl || undefined}
            className="aspect-video w-full bg-black"
            onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
            <AudioPlayer
              src={mediaUrl || undefined}
              variant="full"
              onTimeUpdate={onTimeUpdate}
              audioRef={mediaRef as RefObject<HTMLAudioElement>}
            />
          </div>
        )}
      </div>
    </div>
  );
}
