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
) {
  const response = await axiosClient.post(
    "/announcements",
    request,
  );

  return response.data.data;
}

export async function getAllAnnouncements(query?: AnnouncementQueryFilter) {
  const params: Record<string, any> = {};

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value;
    ***REMOVED***
  ***REMOVED***);
***REMOVED***

  const response = await axiosClient.get<AnnouncementQueryFilterResponse>(
    `/announcements`,
    { params }
  );
  return response.data.data;
}

export async function getAnnouncementById(
  id: number,
): Promise<AnnouncementResponse> {
  const response = await axiosClient.get<AnnouncementResponse>(
    `/announcements/${id}`,
  );

  return response.data;
}

