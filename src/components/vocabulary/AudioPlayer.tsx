import { useCallback, useEffect, useRef, useState } from "react";
import { AudioLines, Pause, Play, VolumeX } from "lucide-react";
import { Button } from "../ui/button";

interface AudioPlayerProps {
  src?: string;
  word?: string;
  className?: string;
  variant?: "minimal" | "full";
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  word,
  className,
  variant = "minimal",
  onTimeUpdate,
  onDurationChange,
  audioRef: externalAudioRef,
}: AudioPlayerProps) {
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const audioRef = externalAudioRef || internalAudioRef;
  const isTransitioningRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioSrc = src ? (src.startsWith("//") ? `https:${src}` : src) : "";
  const hasNothingToPlay = !audioSrc && !word;

  useEffect(() => {
    setPlaying(false);
    setAudioError(!audioSrc);
    setCurrentTime(0);
    setDuration(0);
  }, [audioSrc, word]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioSrc, word, audioRef]);

  const speakWithWebSpeech = useCallback(() => {
    if (!word || !("speechSynthesis" in window)) {
      setAudioError(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
      null;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => {
      setPlaying(false);
      setAudioError(true);
    };

    window.speechSynthesis.speak(utterance);
  }, [word]);

  const toggle = async () => {
    if (hasNothingToPlay || isTransitioningRef.current) return;

    if (audioError || !audioSrc) {
      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
      } else {
        speakWithWebSpeech();
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    isTransitioningRef.current = true;
    try {
      if (playing) {
        audio.pause();
      } else {
        if (audio.ended) {
          audio.currentTime = 0;
        }
        await audio.play();
      }
    } catch (error) {
      console.warn("File MP3 error, falling back to speech synthesis:", error);
      setAudioError(true);
      speakWithWebSpeech();
    } finally {
      isTransitioningRef.current = false;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      if (!isNaN(dur)) {
        setDuration(dur);
        onDurationChange?.(dur);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    onTimeUpdate?.(time);
  };

  const label = hasNothingToPlay
    ? "No audio available"
    : playing
      ? "Pause audio"
      : "Play audio";

  const renderAudioElement = () =>
    audioSrc &&
    !audioError && (
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="auto"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onError={() => setAudioError(true)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    );

  if (variant === "full") {
    return (
      <div
        className={`flex items-center gap-4 bg-muted/30 p-3 rounded-lg border border-border/50 ${className || ""}`}
      >
        {renderAudioElement()}
        <Button
          type="button"
          disabled={hasNothingToPlay}
          onClick={toggle}
          className="h-10 w-10 rounded-full flex-shrink-0 bg-primary/10 hover:bg-primary/20 text-primary p-0 flex items-center justify-center transition-colors"
          aria-label={label}
        >
          {playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
          )}
        </Button>
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            disabled={hasNothingToPlay || duration === 0}
            className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
          />
          <span className="text-xs text-muted-foreground w-10 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {renderAudioElement()}
      <Button
        type="button"
        disabled={hasNothingToPlay}
        aria-pressed={playing}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        className={`inline-flex items-center gap-2 px-3 py-2 bg-muted rounded hover:bg-muted/80 text-tertiary transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
        aria-label={label}
        title={
          hasNothingToPlay
            ? label
            : audioError
              ? "Using the browser's alternate voice"
              : undefined
        }
      >
        {hasNothingToPlay ? (
          <VolumeX className="w-4 h-4" />
        ) : playing ? (
          <Pause className="w-4 h-4" />
        ) : (
          <AudioLines className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}
