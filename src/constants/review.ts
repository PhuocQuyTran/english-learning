export const ReviewMode = {
  DUE: "due",
  QUICK: "quick",
  PRACTICE: "practice",
} as const;

export type SessionMode = (typeof ReviewMode)[keyof typeof ReviewMode];

export const QuickSize = {
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  ALL: "all",
} as const;

export type QuickSize = (typeof QuickSize)[keyof typeof QuickSize];
export const QUICK_SIZE_OPTIONS = Object.values(QuickSize);
export const REVIEW_MODE_OPTIONS = [
  { value: ReviewMode.DUE, label: "Due" },
  { value: ReviewMode.QUICK, label: "Quick" },
  { value: ReviewMode.PRACTICE, label: "Practice" },
] as const;
