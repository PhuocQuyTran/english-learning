import { Button } from "@/components/ui/button";
import { ratingButtons } from "@/constants/ratingButtons";
import type { ReviewRating } from "@/services/reviewApi";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";

interface SessionControlsProps {
  isPractice: boolean;
  isSubmitting: boolean;
  onRate: (rating: ReviewRating) => void;
  onNext: () => void;
  onPrevious?: () => void;
  canGoPrevious?: boolean;
}

export function SessionControls({
  isPractice,
  isSubmitting,
  onRate,
  onNext,
  onPrevious,
  canGoPrevious = false,
}: SessionControlsProps) {
  if (isPractice) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={onPrevious} disabled={!canGoPrevious}>
          <SquareChevronLeft />
        </Button>
        <Button onClick={onNext}>
          <SquareChevronRight />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {ratingButtons.map((button) => (
        <Button
          key={button.rating}
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className={button.className}
          onClick={() => onRate(button.rating)}
        >
          {button.label}
          <span className="ml-1 text-[11px] opacity-70">{button.shortcut}</span>
        </Button>
      ))}
    </div>
  );
}
