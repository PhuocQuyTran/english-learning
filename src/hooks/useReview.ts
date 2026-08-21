import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as reviewApi from "@/services/reviewApi";
import type {
  ReviewHistoryParams,
  SubmitReviewInput,
} from "@/services/reviewApi";
import type { PaginationParams } from "@/services/types";
import { useEffect, useMemo, useState } from "react";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import { useVocabularies } from "@/hooks/useVocabulary";
import { useReviewKeyboardShortcuts } from "@/hooks/useReviewKeyboardShortcuts";
import type { ReviewRating, ReviewSchedule } from "@/services/reviewApi";
import { DUE_REVIEWS_QUERY_KEY, REVIEW_HISTORY_QUERY_KEY } from "@/constants";
import type { QuickSize, SessionMode } from "@/constants/review";

export function useDueReviews(params?: PaginationParams) {
  return useQuery({
    queryKey: [DUE_REVIEWS_QUERY_KEY, params],
    queryFn: () => reviewApi.getDueReviews(params),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SubmitReviewInput) => reviewApi.submitReview(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DUE_REVIEWS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REVIEW_HISTORY_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to submit review");
    },
  });
}

export function useReviewHistory(params?: ReviewHistoryParams) {
  return useQuery({
    queryKey: [REVIEW_HISTORY_QUERY_KEY, params],
    queryFn: () => reviewApi.getReviewHistory(params),
  });
}

export function useReviewSession() {
  const [mode, setMode] = useState<SessionMode>("due");
  const [quickSize, setQuickSize] = useState<QuickSize>(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const dashboardQuery = useDashboardOverview();
  const dueQuery = useDueReviews({ page: 1, limit: 100 });
  const vocabQuery = useVocabularies({ page: 1, limit: 100 });
  const submitReview = useSubmitReview();
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);

  const dueCards = useMemo(() => dueQuery.data?.data ?? [], [dueQuery.data]);

  const practiceCards = useMemo(() => {
    const vocabularies = vocabQuery.data?.data ?? [];
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, quickSize === "all" ? shuffled.length : quickSize);
  }, [quickSize, vocabQuery.data]);

  const sessionCards = useMemo(() => {
    if (mode === "practice") return practiceCards;
    if (mode === "quick") {
      const amount = quickSize === "all" ? dueCards.length : quickSize;
      return dueCards.slice(0, amount);
    }
    return dueCards;
  }, [mode, quickSize, dueCards, practiceCards]);

  const total = sessionCards.length;
  const currentSchedule = sessionCards[currentIndex];
  const isPractice = mode === "practice";
  const isCompleted = total > 0 && reviewedCount >= total;
  const estimatedMinutes = Math.max(1, Math.ceil((total * 20) / 60));

  const restartSession = () => {
    setCurrentIndex(0);
    setReviewedCount(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    restartSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quickSize]);

  const advance = () => {
    setReviewedCount((count) => count + 1);
    setCurrentIndex((index) => index + 1);
    setIsFlipped(false);
  };

  const handleRating = (rating: ReviewRating) => {
    if (!currentSchedule || isPractice) return;
    if (isSubmittingLocal || submitReview.isPending) return;
    setIsSubmittingLocal(true);

    submitReview.mutate(
      { reviewScheduleId: (currentSchedule as ReviewSchedule).id, rating },
      {
        onSuccess: advance,
        onSettled: () => setIsSubmittingLocal(false),
      },
    );
  };

  const handleRatingById = (reviewScheduleId: string, rating: ReviewRating) => {
    if (isPractice) return;
    if (isSubmittingLocal || submitReview.isPending) return;
    setIsSubmittingLocal(true);

    submitReview.mutate(
      { reviewScheduleId, rating },
      { onSuccess: advance, onSettled: () => setIsSubmittingLocal(false) },
    );
  };

  const handleNextPractice = () => {
    setCurrentIndex((index) => index + 1);
    setIsFlipped(false);
    setReviewedCount((count) => count + 1);
  };

  const handlePreviousPractice = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
    setReviewedCount((count) => Math.max(0, count - 1));
    setIsFlipped(false);
  };

  const toggleFlip = () => setIsFlipped((value) => !value);

  useReviewKeyboardShortcuts({
    currentSchedule,
    isCompleted,
    isFlipped,
    isPractice,
    showShortcuts,
    onToggleFlip: toggleFlip,
    onCloseShortcuts: () => setShowShortcuts(false),
    onRate: handleRatingById,
  });

  const sessionEstimateLabel =
    mode === "practice"
      ? "Practice session"
      : mode === "quick"
        ? `Quick review • ${total} cards`
        : `Due review • ${total} cards`;

  const sessionDescription =
    mode === "practice"
      ? "Practice does not update review schedules."
      : "This session will update spaced repetition when you rate cards.";

  return {
    mode,
    setMode,
    quickSize,
    setQuickSize,
    isFlipped,
    toggleFlip,
    reviewedCount,
    total,
    currentSchedule,
    isPractice,
    isCompleted,
    estimatedMinutes,
    sessionEstimateLabel,
    sessionDescription,
    dueCards,
    dashboardQuery,
    dueQuery,
    vocabQuery,
    submitReview,
    isSubmitting: isSubmittingLocal || submitReview.isPending,
    showShortcuts,
    setShowShortcuts,
    restartSession,
    handleRating,
    handleNextPractice,
    handlePreviousPractice,
  };
}
