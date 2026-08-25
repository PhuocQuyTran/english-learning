import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useListeningItemById, useTranscript } from "@/hooks/useListeningItems";
import { AudioPlayer } from "@/components/vocabulary/AudioPlayer";
import { TranscriptPanel } from "@/components/listening/TranscriptPanel";
import { Button } from "@/components/ui/button";

export default function ListeningDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mediaRef = useRef<HTMLMediaElement | HTMLAudioElement>(null);

  const {
    data: item,
    isLoading: isItemLoading,
    isError: isItemError,
    refetch: refetchItem,
  } = useListeningItemById(id ?? "");

  const {
    data: transcriptData,
    isLoading: isTranscriptLoading,
    refetch: refetchTranscript,
  } = useTranscript(id ?? "");

  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  const segments = transcriptData?.segments || [];
  const isProcessing = item?.status === "processing";
  const isFailed = item?.status === "failed";

  const handleTimeUpdate = (time: number) => {
    const nextIndex = segments.findIndex(
      (segment: any) => time >= segment.startTime && time < segment.endTime,
    );
    if (nextIndex >= 0 && nextIndex !== activeSegmentIndex) {
      setActiveSegmentIndex(nextIndex);
    }
  };

  const handleSegmentSelect = (index: number) => {
    setActiveSegmentIndex(index);
    const segment = segments[index];
    if (segment && mediaRef.current) {
      mediaRef.current.currentTime = segment.startTime;
      mediaRef.current.play().catch(console.warn);
    }
  };

  if (isItemLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0D1117]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3FB950]" />
      </div>
    );
  }

  if (isItemError || !item) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0D1117] text-white">
        <p className="mb-4">Could not load audio item.</p>
        <div className="flex gap-3">
          <Button onClick={() => refetchItem()} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Link to="/listening">
            <Button variant="outline">Back to Library</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E6EDF3]">
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link
            to="/listening"
            className="rounded-full p-2 hover:bg-white/5 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{item.title}</h1>
            {item.description && (
              <p className="text-sm text-[#8B949E] mt-1">{item.description}</p>
            )}
          </div>
        </div>

        <div className="mb-8">
          {item.mediaType === "video" ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              controls
              src={item.mediaUrl || undefined}
              className="w-full rounded-lg bg-black"
              onTimeUpdate={(e) =>
                handleTimeUpdate(e.currentTarget.currentTime)
              }
            />
          ) : (
            <AudioPlayer
              src={item.mediaUrl || undefined}
              variant="full"
              onTimeUpdate={handleTimeUpdate}
              audioRef={mediaRef as React.RefObject<HTMLAudioElement>}
            />
          )}
        </div>

        {isTranscriptLoading || isProcessing ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#161B22] p-12 text-[#8B949E]">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#3FB950]" />
            <p>Generating transcript...</p>
            <p className="text-xs mt-2">This may take a few moments</p>
          </div>
        ) : isFailed ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-900/40 bg-[#161B22] p-12 text-red-400">
            <p className="mb-4">Transcription failed.</p>
            <Button
              onClick={() => refetchTranscript()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        ) : segments.length > 0 ? (
          <TranscriptPanel
            segments={segments}
            activeIndex={activeSegmentIndex}
            onSelect={handleSegmentSelect}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#161B22] p-12 text-[#8B949E]">
            <p className="mb-4">No transcript available.</p>
            <Button
              onClick={() => refetchTranscript()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
