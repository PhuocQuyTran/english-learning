import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/services/dashboardApi";

export const DASHBOARD_OVERVIEW_QUERY_KEY = "dashboard-overview";

export function useDashboardOverview() {
  return useQuery({
    queryKey: [DASHBOARD_OVERVIEW_QUERY_KEY],
    queryFn: getDashboardOverview,
  });
}
