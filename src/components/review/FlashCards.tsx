import { AnimatePresence, motion } from "framer-motion";
import type { ReviewSchedule } from "@/services/reviewApi";
import type { Vocabulary } from "@/services/vocabularyApi";
import {
  flashcardBackText,
  normalizePreviewWord,
} from "@/utils/Reviewhelpers ";
import { AudioPlayer } from "../vocabulary/AudioPlayer";

interface FlashcardProps {
  schedule: ReviewSchedule | Vocabulary;
  isFlipped: boolean;
  onFlip: () => void;
  onFlipComplete?: (flipped: boolean) => void;
  practice?: boolean;
}

export function Flashcard({
  schedule,
  isFlipped,
  onFlip,
  onFlipComplete,
  practice = false,
}: FlashcardProps) {
  const vocabulary =
    "vocabulary" in schedule ? schedule.vocabulary : (schedule as Vocabulary);
  const frontWord = practice
    ? (schedule as Vocabulary).word
    : normalizePreviewWord(vocabulary as Vocabulary | undefined);

  const backData = flashcardBackText(schedule as ReviewSchedule);

  return (
    <div
      className="w-full h-[360px] cursor-pointer select-none [perspective:1000px]"
      onClick={onFlip}
    >
      <AnimatePresence>
        <motion.div
          className="relative h-full w-full rounded-2xl border border-border bg-gradient-to-br from-neutral to-background p-6 shadow-md"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          onAnimationComplete={() => onFlipComplete?.(isFlipped)}
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div
            className={`absolute inset-0 h-full w-full flex flex-col items-center justify-center p-6 text-center ${
              isFlipped ? "pointer-events-none" : "pointer-events-auto"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Press SPACE or click to reveal
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              <h1 className="text-4xl font-bold text-foreground">
                {frontWord}
              </h1>
              <div
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <AudioPlayer word={frontWord} />
              </div>
            </div>

            {"ipa" in (practice ? schedule : vocabulary || {}) &&
              (vocabulary as ReviewSchedule["vocabulary"])?.ipa && (
                <div className="mt-2 text-lg text-muted-foreground font-mono">
                  {(vocabulary as ReviewSchedule["vocabulary"])?.ipa}
                </div>
              )}

            {practice && (
              <div className="mt-4 text-xs text-muted-foreground/80 break-words max-w-xs">
                Practice mode does not change review schedule.
              </div>
            )}
          </div>

          <div
            className={`absolute inset-0 h-full w-full flex flex-col justify-center p-6 text-left overflow-y-auto ${
              isFlipped ? "pointer-events-auto" : "pointer-events-none"
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="space-y-4">
              <div className="text-center border-b border-border/50 pb-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Meaning
                </div>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  {practice
                    ? (schedule as Vocabulary).meaning
                    : backData.meaning}
                </p>
              </div>

              {!practice && backData.partOfSpeech && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Part of speech
                  </div>
                  <p className="mt-0.5 text-sm italic text-foreground">
                    {backData.partOfSpeech}
                  </p>
                </div>
              )}

              {backData.example && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Example
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground italic">
                    "{backData.example}"
                  </p>
                </div>
              )}
            </div>

            {!practice && backData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40 mt-2">
                {backData.tags.map((tag, idx) => (
                  <span
                    key={`${tag}-${idx}`}
                    className="rounded bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-secondary/80 dark:text-blue-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
