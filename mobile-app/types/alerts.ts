export enum NotificationType {
  NewComment = 0,
  MatchFound = 1,
  PhotoProcessingFailed = 2,
}

export interface NotificationMatch {
  matchResultId: number;
  oppositeAnnouncementId: number;
  similarityPercentage: number;
  status: number;
  statusLabel: string;
}

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  typeLabel: string;
  isRead: boolean;
  createdOn: string;
  matchResultId: number | null;
  match: NotificationMatch | null;
}

export interface AlertsPage {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: Notification[];
}

export interface AlertsQuery {
  pageNumber: number;
  pageSize: number;
  unreadOnly?: boolean;
}
