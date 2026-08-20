export const REFRESH_TOKEN = "rt";
export const ACCESS_TOKEN = "at";
export const DEFAULT_AVATAR = "/plan-portal/src/assets/vite.svg";
export const LEVEL_VALUES = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const LEVEL_OPTIONS = [
  { value: "", label: "All Levels" },
  ...LEVEL_VALUES.map((level) => ({ value: level, label: level })),
] as const;

export const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
] as const;

export const FILTERS = [
  { value: "all", label: "All" },
  { value: "learning", label: "Learning" },
  { value: "review", label: "Review" },
  { value: "mastered", label: "Mastered" },
] as const;
