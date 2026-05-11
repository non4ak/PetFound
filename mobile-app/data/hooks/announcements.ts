import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements, getAnnouncementById } from "../queries/announcements";
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
