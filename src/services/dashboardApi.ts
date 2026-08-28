import { api } from "@/api/axios";
import { dashboardEndpoints } from "@/services/endpoints";
import type { ApiResponse } from "@/services/types";

export interface DashboardOverview {
  totalVocabularies: number;
  dueReviews: number;
  totalNotes: number;
  streak: number;
  longestStreak: number;
  isActiveToday: boolean;
  recentActivity: { date: string; active: boolean }[];
  todayReviewed: number;
  dailyGoal: number;
}
export async function getDashboardOverview(): Promise<DashboardOverview> {
  const { data } = await api.get<ApiResponse<DashboardOverview>>(
    dashboardEndpoints.overview,
  );
  return data.data;
}
