import { axiosClient } from "@/api/axios-client";
import type { Comment, CommentsPagedResponse, CreateCommentRequest } from "@/types/comment";

export async function getComments(announcementId: number, pageNumber = 0, pageSize = 20) {
  const response = await axiosClient.get<CommentsPagedResponse>(
    `/announcements/${announcementId}/comments`,
    { params: { pageNumber, pageSize } },
  );
  return response.data.data;
}

export async function createComment(announcementId: number, request: CreateCommentRequest) {
  const response = await axiosClient.post<{ data: Comment }>(
    `/announcements/${announcementId}/comments`,
    request,
  );
  return response.data.data;
}
