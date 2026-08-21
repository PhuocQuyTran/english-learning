import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock3,
  History,
  Keyboard,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ReviewHubStats,
  type HubStat,
} from "@/components/review/ReviewHubStats";
import { SessionPreviewCard } from "@/components/review/SessionPreviewCard";
import { ReviewSessionCard } from "@/components/review/ReviewSessionCard";
import Shortcutsdialog from "@/components/review/Shortcutsdialog";
import { useReviewSession } from "@/hooks/useReview";

export default function ReviewPage() {
  const {
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
    isSubmitting,
    showShortcuts,
    setShowShortcuts,
    restartSession,
    handleRating,
    handleNextPractice,
    handlePreviousPractice,
  } = useReviewSession();

  const hubStats: HubStat[] = [
    {
      title: "Due now",
      value: dashboardQuery.data?.dueReviews ?? dueCards.length,
      caption: "cards ready to review",
      icon: <Clock3 className="h-5 w-5 text-primary" />,
    },
    {
      title: "Total cards",
      value:
        dashboardQuery.data?.totalVocabularies ??
        vocabQuery.data?.pagination.total ??
        0,
      caption: "vocabulary in your vault",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
    },
    {
      title: "Review streak",
      value: `${dashboardQuery.data?.streak ?? 0} days`,
      caption: "keep the chain alive",
      icon: <Sparkles className="h-5 w-5 text-primary" />,
    },
    {
      title: "Today reviewed",
      value: dashboardQuery.data?.todayReviewed ?? reviewedCount,
      caption: "already completed today",
      icon: <RefreshCcw className="h-5 w-5 text-primary" />,
    },
  ];

  if (dueQuery.isError || vocabQuery.isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Unable to load review data</AlertTitle>
          <AlertDescription>Please try again in a moment.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 md:p-4 md:p-6">
      <div className="flex justify-end lg:gap-3">
        <div className="flex lg:items-center items-end lg:flex-row flex-col lg:gap-2 gap-1">
          <Link to="/flashcards/history">
            <Button>
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setShowShortcuts(true)}>
            <Keyboard className="h-4 w-4" />
            <span className="hidden lg:inline">Keyboard Shortcuts</span>
          </Button>
        </div>
      </div>

      <Card className="border-border bg-gradient-to-br from-background to-neutral">
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            <div>
              <div className="text-sm uppercase tracking-wide text-muted-foreground">
                Review Hub
              </div>
            </div>
            <ReviewHubStats stats={hubStats} />
          </div>

          <SessionPreviewCard
            mode={mode}
            onModeChange={setMode}
            quickSize={quickSize}
            onQuickSizeChange={setQuickSize}
            sessionEstimateLabel={sessionEstimateLabel}
            estimatedMinutes={estimatedMinutes}
            sessionDescription={sessionDescription}
            onStart={restartSession}
            total={total}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      <ReviewSessionCard
        title={sessionEstimateLabel}
        total={total}
        reviewedCount={reviewedCount}
        isCompleted={isCompleted}
        currentSchedule={currentSchedule}
        isPractice={isPractice}
        isFlipped={isFlipped}
        isSubmitting={isSubmitting}
        onFlip={toggleFlip}
        onRate={handleRating}
        onNextPractice={handleNextPractice}
        onPreviousPractice={handlePreviousPractice}
        onRestart={() => {
          restartSession();
          dueQuery.refetch();
        }}
      />

      <Shortcutsdialog open={showShortcuts} onOpenChange={setShowShortcuts} />
    </div>
  );
}
