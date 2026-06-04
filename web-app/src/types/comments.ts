export interface PagedList<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export interface GetCommentsRespond<T> {
    data: T;
    message: string;
}

export interface CommentDto {
    id: number;
    announcementId: number;
    parentCommentId: number | null;
    commentMessage: string;
    imageUrl: string | null;
    latitude: number | null;
    longitude: number | null;
    locationDescription: string | null;
    commentedAt: string;
    lastModifiedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
    author: {
        id: number;
        userName: string;
  ***REMOVED***;
    replies: CommentDto[];
}

export interface CommentSecondDto {
    id: number;
    announcementId: number;
    parentCommentId: number | null;
    commentMessage: string;
    imageUrl: string | null;
    latitude: number | null;
    longitude: number | null;
    locationDescription: string | null;
    commentedAt: string;
    lastModifiedAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
    authorUserId: number;
    authorUserName: string;
    announcementPetStatus: number;
    announcementPetStatusLabel: string;
    announcementCity: string;
    announcementCountry: string;
}