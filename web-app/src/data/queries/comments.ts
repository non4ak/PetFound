import axiosClient from "@/api/axios-client";
import type { GetCommentsRespond, PagedList, CommentDto } from "@/types/comments";

/*export async function getAnnouncements() {
    

    const response = await axiosClient.get<GetAnnouncementsRespond<PagedList<AnnouncementDto>>>("/admin/announcements", {params: {}});

    return response.data.data;
}*/

export async function getCommentsByAnnouncementId(id: number) {
    const response = await axiosClient.get<GetCommentsRespond<PagedList<CommentDto>>>(`/announcements/${id}/comments`);

    return response.data.data;
}