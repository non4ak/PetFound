export interface AnnouncementDto {
    id: number;
    petId: number;
    petStatus: number;
    petStatusLabel: string;
    petType: number;
    petTypeLabel: string;
    country: string | null;
    city: string | null;
    isActive: boolean;
    createdOn: string;
    reporterUserId: number;
    reporterUserName: string;
    reporterEmail: string;
}

export interface PagedList<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export interface GetAnnouncementsRespond<T> {
    data: T;
    message: string;
}

export interface FullAnnouncementDto extends AnnouncementDto {
    commentsCount: number;
    lastDateWhenSeen: string;
    approximateTime: string;
    petDetails: string;
    isPhonePublic: boolean;
    isTelegramActive: boolean;
    nearLandmark: string;
    lastSeenLatitude: number;
    lastSeenLongitude: number;
    pet: PetDto;
}

export interface PetDto {
    id: number;
    petName: string;
    petType: number;
    petTypeLabel: string;
    breed: string | null;
    petSex: number;
    petSexLabel: string;
    petSize: number;
    petSizeLabel: string;
    petAgeCategory: number;
    petAgeCategoryLabel: string;
    chipNumber: string | null;
    description: string | null;
    petPhotoUrl: string | null;
}