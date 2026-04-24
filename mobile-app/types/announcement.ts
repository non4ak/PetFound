export type AnnouncementType = "lost" | "found";

export interface AnnouncementDetails {
  city: string;
  country: string;
  dateLastSeen: string;
  description: string;
  showPhone: boolean;
  showTelegram: boolean;
  timeApproximate: string;
}
