import type { ReviewRating, ReviewSchedule } from "@/services/reviewApi";
import type { Vocabulary } from "@/services/vocabularyApi";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { Flashcard } from "./FlashCards";
import { AnimatePresence, motion } from "framer-motion";
import { SessionControls } from "./SessionControls";

interface ReviewSessionCardProps {
  title: string;
  total: number;
  reviewedCount: number;
  isCompleted: boolean;
  currentSchedule: ReviewSchedule | Vocabulary | undefined;
  isPractice: boolean;
  isFlipped: boolean;
  isSubmitting: boolean;
  onFlip: () => void;
  onRate: (rating: ReviewRating) => void;
  onNextPractice: () => void;
  onPreviousPractice: () => void;
  onRestart: () => void;
}
export function ReviewSessionCard({
  title,
  total,
  reviewedCount,
  isCompleted,
  currentSchedule,
  isPractice,
  isFlipped,
  isSubmitting,
  onFlip,
  onRate,
  onNextPractice,
  onPreviousPractice,
  onRestart,
}: ReviewSessionCardProps) {
  const [controlsReady, setControlsReady] = useState(false);

  useEffect(() => {
    if (!isFlipped) {
      setControlsReady(false);
      return;
    }

    setControlsReady(false);
  }, [isFlipped, currentSchedule]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>{title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {total > 0
              ? `${Math.min(reviewedCount + 1, total)} / ${total}`
              : "0 / 0"}
          </div>
        </div>
        {total > 0 && (
          <div className="h-2 overflow-hidden rounded bg-secondary">
            <div
              className="h-full bg-tertiary transition-all"
              style={{ width: `${(reviewedCount / total) * 100}%` }}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {total === 0 && (
          <Alert>
            <AlertTitle>You're all caught up!</AlertTitle>
            <AlertDescription>
              No cards are due for review right now.
            </AlertDescription>
          </Alert>
        )}

        {isCompleted && total > 0 && (
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold">Review completed</h2>
            <p className="text-muted-foreground">
              You finished {reviewedCount} cards in this session.
            </p>
            <Button variant="secondary" onClick={onRestart}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh cards
            </Button>
          </div>
        )}

        {!isCompleted && currentSchedule && (
          <div className="space-y-5">
            {isPractice ? (
              <Flashcard
                schedule={currentSchedule as Vocabulary}
                isFlipped={isFlipped}
                onFlip={onFlip}
                onFlipComplete={(flipped) => setControlsReady(flipped)}
                practice
              />
            ) : (
              <Flashcard
                schedule={currentSchedule as ReviewSchedule}
                isFlipped={isFlipped}
                onFlip={onFlip}
                onFlipComplete={(flipped) => setControlsReady(flipped)}
              />
            )}

            <div className="min-h-[52px]">
              <AnimatePresence mode="wait">
                {isFlipped && controlsReady && (
                  <motion.div
                    key={`${currentSchedule?.id ?? "session"}-controls`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="flex justify-center"
                  >
                    <SessionControls
                      isPractice={isPractice}
                      isSubmitting={isSubmitting}
                      onRate={onRate}
                      onNext={onNextPractice}
                      onPrevious={onPreviousPractice}
                      canGoPrevious={reviewedCount > 0}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
