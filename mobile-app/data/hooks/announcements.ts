import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveAnnouncementQuery,
  getAllAnnouncements,
  getAnnouncementById,
  getMyAnnouncements,
  restoreAnnouncementQuery,
  updateAnnouncementQuery,
} from "../queries/announcements";
import type { UpdateAnnouncementRequest } from "../queries/announcements";
import type { AnnouncementQueryFilter } from "@/types/announcement";

export const useGetAnnouncements = (query?: AnnouncementQueryFilter) => {
  return useQuery({
    queryKey: ["announcements", query],
    queryFn: () => getAllAnnouncements(query),
  });
};

export const useGetAnnouncementById = (id: number) => {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => getAnnouncementById(id),
  });
};

export const useGetMyAnnouncements = (query?: AnnouncementQueryFilter) => {
  return useQuery({
    queryKey: ["my-announcements", query],
    queryFn: () => getMyAnnouncements(query),
  });
};

export const useArchiveAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => archiveAnnouncementQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-announcements"] });
    },
  });
};

export const useRestoreAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => restoreAnnouncementQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-announcements"] });
    },
  });
};

export const useUpdateAnnouncement = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateAnnouncementRequest) =>
      updateAnnouncementQuery(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcements", id] });
    },
  });
};
