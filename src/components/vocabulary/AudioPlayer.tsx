import { useRef, useState, useEffect } from "react";
import { Pause, AudioLines } from "lucide-react";

interface AudioPlayerProps {
  src?: string;
  word?: string;
  className?: string;
}

export function AudioPlayer({ src, word, className }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioSrc = src ? (src.startsWith("//") ? `https:${src}` : src) : "";

  useEffect(() => {
    setPlaying(false);
    setAudioError(!audioSrc);
  }, [audioSrc]);

  const speakWithWebSpeech = () => {
    if (!word || !("speechSynthesis" in window)) {
      setAudioError(true);
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => {
      setPlaying(false);
      setAudioError(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggle = async () => {
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
    }
  };

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
          onError={() => {
            setAudioError(true);
          }}
        />
      )}

      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-2 px-3 py-2 bg-muted rounded hover:bg-muted/80 transition-colors ${className || ""}`}
        aria-label={playing ? "Pause audio" : "Play audio"}
        title={audioError ? "Using the browser's alternate voice" : undefined}
      >
        {playing ? (
          <Pause className="w-4 h-4" />
        ) : (
          <AudioLines className="w-4 h-4" />
        )}
      </button>
    </>
  );
}
