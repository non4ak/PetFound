import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments } from "../queries/comments";
import type { CreateCommentRequest } from "@/types/comment";

export const useGetComments = (announcementId: number) => {
  return useQuery({
    queryKey: ["comments", announcementId],
    queryFn: () => getComments(announcementId),
    enabled: announcementId > 0,
***REMOVED***);
};

export const useCreateComment = (announcementId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateCommentRequest) => createComment(announcementId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", announcementId] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
  ***REMOVED***,
***REMOVED***);
};
