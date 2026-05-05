import axiosClient from "@/api/axios-client";
import type { PagedList, AnnouncementDto, GetAnnouncementsRespond, FullAnnouncementDto } from "@/types/announcements";

export async function getAnnouncements(petType?: number, status?: number, isActive?: boolean, city?: string, country?: string, pageNumber?: number, pageSize?: number) {
    /*const requestBody: GetUsers = {
        search: params.search,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
  ***REMOVED***;*/

    const response = await axiosClient.get<GetAnnouncementsRespond<PagedList<AnnouncementDto>>>("/admin/announcements", {params: {petType: petType, PetStatus: status, isActive: isActive, city: city, country: country, pageNumber: pageNumber, pageSize: pageSize}});

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

export async function editAnnouncement(id: number, petStatus: number, city: string, country: string, petDetails: string, lastDateWhenSeen: string, approximateTime: string, isPhonePublic: boolean, isTelegramActive: boolean, nearLandmark: string, latitude: number, longitude: number) {
    const requestBody = {
        "country": country,
        "city": city,
        "lastDateWhenSeen": lastDateWhenSeen,
        "approximateTime": approximateTime,
        "petDetails": petDetails,
        "isPhonePublic": isPhonePublic,
        "isTelegramActive": isTelegramActive,
        "nearLandmark": nearLandmark,
        "lastSeenLatitude": latitude,
        "lastSeenLongitude": longitude,
        "petStatus": petStatus
  ***REMOVED***;
    console.log("Request body for editing announcement:", requestBody); // Debug alert
    await axiosClient.put(`/admin/announcements/${id}`, requestBody);
}