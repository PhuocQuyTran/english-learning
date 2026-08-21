import { useCallback, useEffect, useRef, useState } from "react";
import { AudioLines, Pause, VolumeX } from "lucide-react";
import { Button } from "../ui/button";

interface AudioPlayerProps {
  src?: string;
  word?: string;
  className?: string;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
}

export function AudioPlayer({ src, word, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isTransitioningRef = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioSrc = src ? (src.startsWith("//") ? `https:${src}` : src) : "";
  const hasNothingToPlay = !audioSrc && !word;

  useEffect(() => {
    setPlaying(false);
    setAudioError(!audioSrc);
  }, [audioSrc, word]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioSrc, word]);

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
      console.warn("File MP3 lỗi, chuyển sang giọng đọc trình duyệt:", error);
      setAudioError(true);
      speakWithWebSpeech();
    } finally {
      isTransitioningRef.current = false;
    }
  };

  const label = hasNothingToPlay
    ? "No audio available"
    : playing
      ? "Pause audio"
      : "Play audio";

  return (
    <>
      {audioSrc && !audioError && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="auto"
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onError={() => setAudioError(true)}
        />
      )}
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
