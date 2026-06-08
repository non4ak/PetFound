export enum MatchResultStatus {
  Pending = 0,
  Rejected = 1,
  Approved = 2,
}

export interface MatchAnnouncementSummary {
  city: string | null;
  country: string | null;
  id: number;
  isActive: boolean;
  petName: string;
  petPhotoUrl: string | null;
  petStatus: number;
  petStatusLabel: string;
}

export interface MatchResult {
  createdOn: string;
  id: number;
  myAnnouncementId: number;
  oppositeAnnouncement: MatchAnnouncementSummary;
  oppositeAnnouncementId: number;
  similarityPercentage: number;
  status: MatchResultStatus;
  statusLabel: string;
}

export interface MatchQuery {
  pageNumber: number;
  pageSize: number;
  status?: MatchResultStatus;
}

export interface MatchPage {
  currentPage: number;
  items: MatchResult[];
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface MatchQueryResponse {
  data: MatchPage;
  message: string;
}
