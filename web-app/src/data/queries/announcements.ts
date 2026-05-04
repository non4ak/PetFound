import axiosClient from "@/api/axios-client";
import type { PagedList, AnnouncementDto, GetAnnouncementsRespond, FullAnnouncementDto } from "@/types/announcements";

export async function getAnnouncements(petType?: number, status?: number, isActive?: boolean, city?: string, country?: string) {
    /*const requestBody: GetUsers = {
        search: params.search,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
    };*/

    const response = await axiosClient.get<GetAnnouncementsRespond<PagedList<AnnouncementDto>>>("/admin/announcements", {params: {petType: petType, PetStatus: status, isActive: isActive, city: city, country: country}});

    return response.data.data;
}

export async function getAnnouncementById(id: number) {
    const response = await axiosClient.get<GetAnnouncementsRespond<FullAnnouncementDto>>(`/admin/announcements/${id}`);

    return response.data.data;
}

export async function archiveAnnouncement(id: number) {
    await axiosClient.post(`/admin/announcements/${id}/archive`);
}

export async function restoreAnnouncement(id: number) {
    await axiosClient.post(`/admin/announcements/${id}/restore`);
}