import { useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { WaveformLive } from "./WaveFormLive";
import { WaveformStatic } from "./WaveFormStatic";
import type { Recording } from "@/types/listening";
import { formatMs } from "@/utils/duration";
import { Button } from "@/components/ui/button";

interface RecordBlockProps {
  segmentSequence: number;
  recordings: Recording[];
  bestId: string | null;
  onRecorded: (r: Recording) => void;
  onDelete: (id: string) => void;
}

export function RecordBlock({
  recordings,
  bestId,
  onRecorded,
  onDelete,
}: RecordBlockProps) {
  const { status, error, elapsedMs, analyserNode, start, stop } =
    useAudioRecorder({ onRecorded });

  const isRecording = status === "recording";
  const isRequesting = status === "requesting";

  const handleMicClick = () => {
    if (isRecording) stop();
    else start();
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#8B949E]">
        <Mic className="h-3.5 w-3.5" />
        Your recording
      </div>

      <div className="flex flex-col items-center gap-3 pb-2">
        <Button
          onClick={handleMicClick}
          disabled={isRequesting}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          aria-pressed={isRecording}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all",
            isRecording
              ? "border-red-500 bg-red-500/10 animate-pulse"
              : "border-white/20 bg-[#0D1117] hover:border-white/40",
            isRequesting && "opacity-50 cursor-wait",
          )}
        >
          {isRecording ? (
            <Square className="h-5 w-5 fill-red-400 text-red-400" />
          ) : (
            <Mic className="h-5 w-5 text-[#8B949E]" />
          )}
        </Button>

        <p
          className={cn(
            "text-xs",
            isRecording ? "font-medium text-red-400" : "text-[#8B949E]",
          )}
        >
          {isRequesting
            ? "Requesting microphone..."
            : isRecording
              ? "Recording... tap to stop"
              : "Tap to start recording"}
        </p>

        {isRecording && (
          <span className="text-xs tabular-nums text-[#8B949E]">
            {formatMs(elapsedMs)}
          </span>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {isRecording && (
        <div className="mb-3 overflow-hidden rounded-lg bg-[#0D1117] p-2">
          <WaveformLive
            analyserNode={analyserNode}
            isActive={isRecording}
            color="#e24b4a"
            height={40}
          />
        </div>
      )}

      {recordings.length > 0 && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-[#8B949E]">
            <List className="h-3.5 w-3.5" />
            Recordings
          </div>
          <div className="flex flex-col gap-2">
            {recordings.map((rec, idx) => (
              <RecordingRow
                key={rec.id}
                recording={rec}
                index={recordings.length - idx}
                isBest={rec.id === bestId}
                onDelete={() => onDelete(rec.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface RecordingRowProps {
  recording: Recording;
  index: number;
  isBest: boolean;
  onDelete: () => void;
}

function RecordingRow({
  recording,
  index,
  isBest,
  onDelete,
}: RecordingRowProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play()
        .then(() => setPlaying(true))
        .catch(console.warn);
    }
  };

  const score = recording.score;
  const scoreColor =
    score == null
      ? "text-[#8B949E]"
      : score >= 85
        ? "text-[#3FB950]"
        : score >= 70
          ? "text-yellow-400"
          : "text-red-400";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border p-2",
        isBest
          ? "border-[#3FB950]/40 bg-[#3FB950]/5"
          : "border-white/10 bg-[#0D1117]",
      )}
    >
      <audio
        ref={audioRef}
        src={recording.url}
        onEnded={() => setPlaying(false)}
      />

      <span className="w-5 text-center text-[10px] text-[#8B949E]">
        #{index}
      </span>

      <div className="min-w-0 flex-1 overflow-hidden rounded">
        <WaveformStatic
          seed={recording.id}
          barCount={28}
          color={isBest ? "#3FB950" : "#888780"}
          height={20}
        />
      </div>

      {isBest && (
        <span className="shrink-0 rounded bg-[#3FB950]/15 px-1.5 py-0.5 text-[9px] font-medium text-[#3FB950]">
          Best
        </span>
      )}

      <span
        className={cn("shrink-0 text-xs font-medium tabular-nums", scoreColor)}
      >
        {score != null ? `${score}%` : "—"}
      </span>

      <span className="shrink-0 text-[10px] tabular-nums text-[#8B949E]">
        {formatMs(recording.durationMs)}
      </span>

      <Button
        onClick={togglePlay}
        variant="outline"
        aria-label={playing ? "Pause" : "Play"}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#161B22]"
      >
        {playing ? (
          <Pause className="h-3 w-3 text-[#8B949E]" />
        ) : (
          <Play className="h-3 w-3 text-[#8B949E]" />
        )}
      </Button>

      <Button
        onClick={onDelete}
        variant="outline"
        aria-label="Delete recording"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-red-500/10"
      >
        <Trash2 className="h-3.5 w-3.5 text-[#8B949E] hover:text-red-400" />
      </Button>
    </div>
  );
}
