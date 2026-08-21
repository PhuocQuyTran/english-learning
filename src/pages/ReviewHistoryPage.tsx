import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommonTable, type Column } from "@/components/ui/commonTable";
import { useReviewHistory } from "@/hooks/useReview";
import type { ReviewHistoryItem } from "@/services/reviewApi";

const ratingLabels = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};

export default function ReviewHistoryPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const historyQuery = useReviewHistory({ page, limit });
  const items = historyQuery.data?.data ?? [];
  const pagination = historyQuery.data?.pagination;

  const columns: Column<ReviewHistoryItem>[] = [
    {
      key: "vocabulary_id",
      title: "Vocabulary",
      render: (_, item) => (
        <span className="font-medium">
          {item.vocabulary?.word || item.vocabulary_id}
        </span>
      ),
    },
    {
      key: "rating",
      title: "Rating",
      render: (rating: ReviewHistoryItem["rating"]) => ratingLabels[rating],
    },
    {
      key: "previous_interval_days",
      title: "Previous",
      render: (days: number) => `${days} days`,
    },
    {
      key: "new_interval_days",
      title: "New",
      render: (days: number) => `${days} days`,
    },
    {
      key: "reviewed_at",
      title: "Reviewed",
      render: (reviewedAt: string) => (
        <span className="text-muted-foreground">
          {new Date(reviewedAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <Link to="/flashcards">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Review
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyQuery.isError && (
            <div className="mb-4 text-red-600">
              Unable to load review history.
            </div>
          )}

          <CommonTable
            data={items}
            columns={columns}
            total={pagination?.total || 0}
            isLoading={historyQuery.isLoading}
            emptyIcon={<History />}
            emptyString="No reviews yet."
            emptySearchString="No review history matches your filters."
            paginationData={
              pagination
                ? {
                    page: pagination.page,
                    pageSize: pagination.limit,
                    total: pagination.total,
                  }
                : undefined
            }
            rowKey="id"
          />
        </CardContent>
      </Card>
    </div>
  );
}
