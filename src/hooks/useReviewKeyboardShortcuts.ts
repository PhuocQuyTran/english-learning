import { useEffect } from "react";
import { ratingButtons } from "@/constants/ratingButtons";
import { isTypingTarget } from "@/utils/Reviewhelpers ";
import type { ReviewRating, ReviewSchedule } from "@/services/reviewApi";
import type { Vocabulary } from "@/services/vocabularyApi";

interface UseReviewKeyboardShortcutsOptions {
  currentSchedule: ReviewSchedule | Vocabulary | undefined;
  isCompleted: boolean;
  isFlipped: boolean;
  isPractice: boolean;
  showShortcuts: boolean;
  onToggleFlip: () => void;
  onCloseShortcuts: () => void;
  onRate: (reviewScheduleId: string, rating: ReviewRating) => void;
}

export function useReviewKeyboardShortcuts({
  currentSchedule,
  isCompleted,
  isFlipped,
  isPractice,
  showShortcuts,
  onToggleFlip,
  onCloseShortcuts,
  onRate,
}: UseReviewKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseShortcuts();
        return;
      }

      if (isTypingTarget(event.target)) return;
      if (showShortcuts) return;

      if (event.code === "Space") {
        event.preventDefault();
        if (!isCompleted && currentSchedule) {
          onToggleFlip();
        }
      }

      if (!isFlipped || !currentSchedule) return;

      const shortcut = ratingButtons.find(
        (item) => item.shortcut === event.key,
      );
      if (shortcut && !isPractice) {
        event.preventDefault();
        const reviewScheduleId =
          "id" in currentSchedule ? currentSchedule.id : "";
        onRate(reviewScheduleId, shortcut.rating);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentSchedule,
    isCompleted,
    isFlipped,
    isPractice,
    showShortcuts,
    onCloseShortcuts,
    onToggleFlip,
    onRate,
  ]);
}
