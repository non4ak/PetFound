export interface CommentAuthor {
  id: number;
  userName: string;
}

export interface Comment {
  id: number;
  announcementId: number;
  parentCommentId: number | null;
  commentMessage: string;
  commentedAt: string;
  imageUrl?: string | null;
  isDeleted: boolean;
  author: CommentAuthor;
  replies: Comment[];
}

export interface CommentsPagedData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: Comment[];
}

export interface CommentsPagedResponse {
  message: string;
  data: CommentsPagedData;
}

export interface CreateCommentRequest {
  commentMessage: string;
  parentCommentId?: number;
  imageUrl?: string;
}
