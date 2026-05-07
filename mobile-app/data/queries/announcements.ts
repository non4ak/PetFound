import { axiosClient } from "@/api/axios-client";
import type { ApiResponse } from "@/types/auth";
import type {
  AnnouncementResponse,
  CreateAnnouncementRequest,
  AnnouncementQueryFilter,
  AnnouncementQueryFilterResponse
} from "@/types/announcement";

export async function createAnnouncementQuery(
  request: CreateAnnouncementRequest,
): Promise<AnnouncementResponse> {
  const response = await axiosClient.post<ApiResponse<AnnouncementResponse>>(
    "/announcements",
    request,
  );

  return response.data.data;
}

export async function getAllAnnouncements(query?: AnnouncementQueryFilter) {
  const params: Record<string, any> = {};

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      // Exclude undefined, null, and empty strings
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value;
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  const response = await axiosClient.get<AnnouncementQueryFilterResponse>(
    `/announcements`,
    { params }
  );
  return response.data;
}


