import axiosClient from "@/api/axios-client";
import type { PagedList, AnnouncementDto, GetAnnouncementsRespond, FullAnnouncementDto } from "@/types/announcements";

export async function getAnnouncements() {
    /*const requestBody: GetUsers = {
        search: params.search,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
  ***REMOVED***;*/

    const response = await axiosClient.get<GetAnnouncementsRespond<PagedList<AnnouncementDto>>>("/admin/announcements", {params: {}});

    return response.data.data;
}

export async function getAnnouncementById(id: number) {
    const response = await axiosClient.get<GetAnnouncementsRespond<FullAnnouncementDto>>(`/admin/announcements/${id}`);

    return response.data.data;
}