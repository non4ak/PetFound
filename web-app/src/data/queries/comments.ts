import axiosClient from "@/api/axios-client";
import type { GetCommentsRespond, PagedList, CommentDto, CommentSecondDto } from "@/types/comments";

/*export async function getAnnouncements() {
    

    const response = await axiosClient.get<GetAnnouncementsRespond<PagedList<AnnouncementDto>>>("/admin/announcements", {params: {}});

    return response.data.data;
}*/

export async function getCommentsByAnnouncementId(id: number) {
    const response = await axiosClient.get<GetCommentsRespond<PagedList<CommentDto>>>(`/announcements/${id}/comments`);

    return response.data.data;
}

export async function getAllComments(announcementId: number | null, pageNumber: number, pageSize: number, isDeleted: boolean | null) {
    const response = await axiosClient.get<GetCommentsRespond<PagedList<CommentSecondDto>>>(`/admin/comments`, {params:{announcementId: announcementId,pageNumber: pageNumber, pageSize: pageSize, isDeleted: isDeleted}});

    return response.data.data;
}

export async function deleteComment(announcementId: number, commentId: number) {
    return await axiosClient.delete(`/admin/announcements/${announcementId}/comments/${commentId}`);
}