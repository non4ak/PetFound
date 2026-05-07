import { useQuery } from "@tanstack/react-query";
import { getAllAnnouncements } from "../queries/announcements";
import type { AnnouncementQueryFilter } from "@/types/announcement";

export const useGetAnnouncements = (query?: AnnouncementQueryFilter) => {
  return useQuery({
    queryKey: ["announcements", query],
    queryFn: () => getAllAnnouncements(query),
  });
};