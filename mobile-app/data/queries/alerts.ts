import { axiosClient } from "@/api/axios-client";
import type { AlertsPage, AlertsQuery } from "@/types/alerts";

interface AlertsApiResponse {
  data: AlertsPage;
}

export async function getAlerts(query: AlertsQuery): Promise<AlertsPage> {
  const response = await axiosClient.get<AlertsApiResponse>("/notifications", {
    params: query,
***REMOVED***);

  return response.data.data;
}
