import { api } from "@/api/axios";
import { reviewEndpoints } from "@/services/endpoints";
import type { PaginatedApiResponse, PaginationParams } from "@/services/types";

export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface ReviewVocabulary {
  id: string;
  word: string;
  meaning: string;
  ipa?: string | null;
  part_of_speech?: string | null;
  example?: string | null;
  level?: string | null;
  tags?: string[] | null;
}

export interface ReviewSchedule {
  id: string;
  user_id: string;
  vocabulary_id: string;
  next_review_at: string;
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  created_at: string;
  updated_at: string;
  vocabulary?: ReviewVocabulary;
}

export interface SubmitReviewInput {
  reviewScheduleId: string;
  rating: ReviewRating;
}

export interface ReviewHistoryItem {
  id: string;
  user_id: string;
  vocabulary_id: string;
  review_schedule_id: string;
  rating: ReviewRating;
  previous_interval_days: number;
  new_interval_days: number;
  reviewed_at: string;
  created_at: string;
  vocabulary?: Pick<ReviewVocabulary, "id" | "word">;
}

export interface ReviewHistoryParams extends PaginationParams {
  vocabularyId?: string;
}

export async function getDueReviews(
  params?: PaginationParams,
): Promise<PaginatedApiResponse<ReviewSchedule>> {
  const { data } = await api.get<PaginatedApiResponse<ReviewSchedule>>(
    reviewEndpoints.due,
    { params },
  );
  return data;
}

export async function submitReview(
  input: SubmitReviewInput,
): Promise<ReviewSchedule> {
  const { data } = await api.post<{ success: true; data: ReviewSchedule }>(
    reviewEndpoints.submit,
    input,
  );
  return data.data;
}

export async function getReviewHistory(
  params?: ReviewHistoryParams,
): Promise<PaginatedApiResponse<ReviewHistoryItem>> {
  const { data } = await api.get<PaginatedApiResponse<ReviewHistoryItem>>(
    reviewEndpoints.history,
    { params },
  );
  return data;
}
