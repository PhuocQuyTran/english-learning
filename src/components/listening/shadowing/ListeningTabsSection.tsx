import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TranscriptSegment } from "@/types/listening";
import {
  MessageSquare,
  BookOpen,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { TranscriptPanel } from "./TranscriptPanel";
import { NotesTab } from "./NotesTab";
import { VocabularyTab } from "./VocabularyTab";

const ListeningDetailTab = {
  TRANSCRIPT: "transcript",
  NOTES: "notes",
  VOCABULARY: "vocabulary",
} as const;

const LISTENING_DETAIL_TABS_CONFIG = [
  {
    value: ListeningDetailTab.TRANSCRIPT,
    label: "Transcript",
    icon: FileText,
  },
  {
    value: ListeningDetailTab.NOTES,
    label: "Notes",
    icon: MessageSquare,
  },
  {
    value: ListeningDetailTab.VOCABULARY,
    label: "Vocabulary",
    icon: BookOpen,
  },
] as const;
export interface ListeningTabsSectionProps {
  audioItemId: string;
  level?: string;
  isTranscriptLoading: boolean;
  isProcessing: boolean;
  isFailed: boolean;
  segments: TranscriptSegment[];
  activeSegmentIndex: number;
  onSegmentSelect: (index: number) => void;
  onRefetchTranscript: () => void;
  onOpenShadowing?: (index: number) => void;
}
export function ListeningTabsSection({
  audioItemId,
  level,
  isTranscriptLoading,
  isProcessing,
  isFailed,
  segments,
  activeSegmentIndex,
  onSegmentSelect,
  onRefetchTranscript,
  onOpenShadowing,
}: ListeningTabsSectionProps) {
  return (
    <Tabs
      defaultValue={ListeningDetailTab.TRANSCRIPT}
      className="w-full h-full flex flex-col"
    >
      <TabsList className="grid w-full grid-cols-3 bg-[#161B22] border border-white/10">
        {LISTENING_DETAIL_TABS_CONFIG.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="data-[state=active]:bg-[#21262D] data-[state=active]:text-[#E6EDF3]"
          >
            <Icon className="h-4 w-4 mr-2" /> {label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value={ListeningDetailTab.TRANSCRIPT}
        className="flex-1 mt-4"
      >
        {isTranscriptLoading || isProcessing ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#161B22] text-[#8B949E]">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#3FB950]" />
            <p>Generating transcript...</p>
            <p className="text-xs mt-2">This may take a few moments</p>
          </div>
        ) : isFailed ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-red-900/40 bg-[#161B22] p-12 text-red-400">
            <p className="mb-4">Transcription failed.</p>
            <Button onClick={onRefetchTranscript} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        ) : segments.length > 0 ? (
          <TranscriptPanel
            segments={segments}
            activeIndex={activeSegmentIndex}
            audioItemId={audioItemId}
            level={level}
            onSelect={onSegmentSelect}
            onOpenShadowing={onOpenShadowing}
          />
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#161B22] text-[#8B949E]">
            <p className="mb-4">No transcript available.</p>
            <Button onClick={onRefetchTranscript} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Try again
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value={ListeningDetailTab.NOTES} className="mt-4">
        <NotesTab audioItemId={audioItemId} />
      </TabsContent>

      <TabsContent value={ListeningDetailTab.VOCABULARY} className="mt-4">
        <VocabularyTab audioItemId={audioItemId} segments={segments} />
      </TabsContent>
    </Tabs>
  );
}
