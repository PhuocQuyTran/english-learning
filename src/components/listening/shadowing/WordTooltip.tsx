import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Loader2, BookmarkPlus, BookmarkCheck, Volume2 } from "lucide-react";
import { useDictionary, useCreateVocabulary } from "@/hooks/useVocabulary";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import type { ExtractedWord } from "@/services/dictionaryApi";
import { AudioPlayer } from "@/components/vocabulary/AudioPlayer";

interface WordTooltipProps {
  word: string;
  audioItemId: string;
  level?: string;
  isSaved?: boolean;
  isHighlighted?: boolean;
  extractedData?: ExtractedWord;
  children: React.ReactNode;
}

export function WordTooltip({
  word,
  audioItemId,
  level,
  isSaved = false,
  isHighlighted = false,
  extractedData,
  children,
}: WordTooltipProps) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const {
    data: entries,
    isLoading,
    isError,
  } = useDictionary(open && !extractedData ? word : "");

  const createMutation = useCreateVocabulary();
  const dictEntry = entries?.[0];
  const displayWord = extractedData?.word ?? dictEntry?.word ?? word;
  const phonetic = extractedData?.phonetic ?? dictEntry?.phonetic;
  const partOfSpeech =
    extractedData?.partOfSpeech ?? dictEntry?.meanings?.[0]?.partOfSpeech;
  const meaning = extractedData?.meaning ?? dictEntry?.vietnameseTranslation;
  const definition = dictEntry?.meanings?.[0]?.definitions?.[0]?.definition;
  const example =
    extractedData?.example ??
    dictEntry?.meanings?.[0]?.definitions?.[0]?.example;
  const audioUrl = dictEntry?.phonetics?.find((p) => p.audio)?.audio;

  const hasData = !!(extractedData || dictEntry);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saveMeaning = meaning ?? definition;
    if (!saveMeaning) {
      toast.error("No definition found");
      return;
    }

    createMutation.mutate(
      {
        word: displayWord,
        ipa: phonetic,
        partOfSpeech,
        meaning: saveMeaning,
        example,
        level,
        tags: [`listening:${audioItemId}`],
      },
      {
        onSuccess: () => {
          setSaved(true);
          toast.success(`"${displayWord}" saved to vocabulary`);
        },
        onError: () => toast.error("Failed to save, please try again"),
      },
    );
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            (e.nativeEvent as any).isWordClick = true;
          }}
          className={cn(
            "cursor-pointer rounded-sm px-0.5 transition-colors",
            saved || isSaved
              ? "underline decoration-[#3FB950] decoration-dotted underline-offset-2 text-[#3FB950]"
              : isHighlighted
                ? "underline decoration-amber-400 decoration-dotted underline-offset-2"
                : "hover:bg-white/10 hover:text-[#E6EDF3]",
          )}
        >
          {children}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          onClick={(e) => e.stopPropagation()}
          className="z-50 w-64 rounded-xl border border-white/10 bg-[#161B22] shadow-2xl outline-none
              data-[state=delayed-open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95"
        >
          {isLoading && !extractedData && (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-[#8B949E]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Looking up...
            </div>
          )}

          {isError && !extractedData && (
            <p className="px-3 py-3 text-xs text-red-400">Word not found</p>
          )}

          {(hasData || extractedData) && (
            <>
              <div className="flex items-start justify-between gap-2 border-b border-white/10 px-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-[#E6EDF3]">
                      {displayWord}
                    </span>
                    {partOfSpeech && (
                      <span className="text-[10px] italic text-[#8B949E]">
                        {partOfSpeech}
                      </span>
                    )}
                  </div>
                  {phonetic && (
                    <span className="text-[11px] text-[#8B949E]">
                      {phonetic}
                    </span>
                  )}
                </div>
                {audioUrl && <AudioPlayer word={word} />}
              </div>

              <div className="px-3 py-2.5 space-y-1.5">
                {meaning && (
                  <div className="flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0 text-[9px] font-medium uppercase tracking-wide text-[#3FB950]">
                      VI
                    </span>
                    <p className="text-[13px] font-medium leading-snug text-[#E6EDF3]">
                      {meaning}
                    </p>
                  </div>
                )}

                {definition && (
                  <div className="flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0 text-[9px] font-medium uppercase tracking-wide text-[#8B949E]">
                      EN
                    </span>
                    <p className="text-[12px] leading-snug text-[#8B949E]">
                      {definition}
                    </p>
                  </div>
                )}

                {example && (
                  <p className="text-[11px] italic text-[#8B949E] border-l-2 border-white/10 pl-2">
                    "{example}"
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 px-3 py-2">
                <button
                  onClick={handleSave}
                  disabled={saved || isSaved || createMutation.isPending}
                  className={cn(
                    "flex w-full items-center justify-center gap-1.5 rounded-lg border py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed",
                    saved || isSaved
                      ? "border-[#3FB950]/40 text-[#3FB950] opacity-70"
                      : "border-white/10 text-[#8B949E] hover:border-[#3FB950] hover:text-[#3FB950]",
                  )}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : saved || isSaved ? (
                    <BookmarkCheck className="h-3 w-3" />
                  ) : (
                    <BookmarkPlus className="h-3 w-3" />
                  )}
                  {saved || isSaved ? "Saved" : "Save to vocabulary"}
                </button>
              </div>
            </>
          )}

          <Popover.Arrow className="fill-[#161B22]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
