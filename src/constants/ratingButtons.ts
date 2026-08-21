import type { ReviewRating } from "@/services/reviewApi";

export interface RatingButtonConfig {
  rating: ReviewRating;
  label: string;
  shortcut: string;
  className: string;
}

export const ratingButtons: RatingButtonConfig[] = [
  {
    rating: "again",
    label: "Again",
    shortcut: "1",
    className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  },
  {
    rating: "hard",
    label: "Hard",
    shortcut: "2",
    className:
      "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  },
  {
    rating: "good",
    label: "Good",
    shortcut: "3",
    className: "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  },
  {
    rating: "easy",
    label: "Easy",
    shortcut: "4",
    className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
];
