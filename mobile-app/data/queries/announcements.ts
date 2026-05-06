import { axiosClient } from "@/api/axios-client";
import type { ApiResponse } from "@/types/auth";
import type {
  AnnouncementResponse,
  CreateAnnouncementRequest,
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
