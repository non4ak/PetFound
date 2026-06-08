import { useQuery } from "@tanstack/react-query";

import { getAlerts } from "@/data/queries/alerts";
import type { AlertsQuery } from "@/types/alerts";

const DEFAULT_ALERTS_QUERY: AlertsQuery = {
  pageNumber: 0,
  pageSize: 20,
};

export function useGetAlerts(query?: AlertsQuery) {
  const resolvedQuery: AlertsQuery = query ?? DEFAULT_ALERTS_QUERY;

  return useQuery({
    queryKey: ["alerts", resolvedQuery],
    queryFn: () => getAlerts(resolvedQuery),
  });
}
