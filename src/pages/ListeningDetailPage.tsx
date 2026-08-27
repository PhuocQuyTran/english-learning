import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useListeningItemById, useTranscript } from "@/hooks/useListeningItems";
import { Button } from "@/components/ui/button";
import { ListeningMediaPlayer } from "@/components/listening/shadowing/ListeningMediaPlayer";
import { ListeningTabsSection } from "@/components/listening/shadowing/ListeningTabsSection";
import { BottomPlayerBar } from "@/components/listening/shadowing/BottomPlayerBar";
import { formatDuration } from "@/utils/duration";
import type { TranscriptSegment } from "@/types/listening";
import { PracticeModal } from "@/components/listening/shadowing/PracticeModal";

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

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isProcessing = item?.status === "processing";
  const isFailed = item?.status === "failed";
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);

  const segments: TranscriptSegment[] = transcriptData?.segments || [];
  const handleSegmentSelect = (index: number) => {
    setActiveSegmentIndex(index);
    const segment = segments[index];
    if (segment && mediaRef.current) {
      mediaRef.current.currentTime = segment.startTime;
      mediaRef.current.play().catch(console.warn);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);

    if (mediaRef.current?.duration) {
      setDuration(mediaRef.current.duration);
    }

    const nextIndex = segments.findIndex(
      (segment: any) => time >= segment.startTime && time < segment.endTime,
    );
    if (nextIndex >= 0 && nextIndex !== activeSegmentIndex) {
      setActiveSegmentIndex(nextIndex);
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
      <div className="mx-auto w-full max-w-7xl px-1 md:px-20">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/listening"
              className="rounded-full p-2 hover:bg-white/5 transition-colors text-[#8B949E] hover:text-[#C9D1D9]"
              aria-label="Back to Library"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{item?.title}</h1>
                {item?.level && (
                  <span className="rounded-full border border-[#3FB950]/30 bg-[#3FB950]/10 px-2 py-0.5 text-xs font-medium text-[#3FB950]">
                    {item?.level}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#8B949E] mt-1">
                {item?.durationSeconds && formatDuration(item.durationSeconds)}
                {item?.created_at &&
                  ` • Uploaded on ${new Date(item.created_at).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full gap-8 pb-20">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ListeningMediaPlayer
              mediaType={item.mediaType ?? undefined}
              mediaUrl={item.mediaUrl ?? undefined}
              mediaRef={mediaRef}
              onTimeUpdate={handleTimeUpdate}
            />

            <ListeningTabsSection
              audioItemId={id!}
              isTranscriptLoading={isTranscriptLoading}
              isProcessing={isProcessing}
              isFailed={isFailed}
              segments={segments}
              activeSegmentIndex={activeSegmentIndex}
              onSegmentSelect={handleSegmentSelect}
              onRefetchTranscript={refetchTranscript}
              onOpenShadowing={setPracticeIndex}
            />
          </div>
        </div>
        <BottomPlayerBar
          mediaRef={mediaRef}
          currentTime={currentTime}
          duration={duration || item?.durationSeconds || 0}
        />
        {practiceIndex !== null && (
          <PracticeModal
            segments={segments}
            currentIndex={practiceIndex}
            audioSrc={item?.mediaUrl ?? undefined}
            onNavigate={setPracticeIndex}
            onClose={() => setPracticeIndex(null)}
          />
        )}
      </div>
    </div>
  );
}
