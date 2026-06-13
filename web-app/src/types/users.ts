export interface GetUsers {
    search: string;
    pageNumber: number;
    pageSize: number;
}

export interface UserDto {
    id: number;
    userName: string;
    email: string;
    country: string | null;
    city: string | null;
    phoneNumber: string | null;
    socialNetwork: string | null;
    notificationChannelPreference: number | null;
    notificationChannelPreferenceLabel: string | null;
    registeredAt: string;
    isDeactivated: boolean;
    lockoutEnd: string | null;
    roles: string[];
}

export interface FullUserDto {
    id: number;
    userName: string;
    email: string;
    country: string | null;
    city: string | null;
    phoneNumber: string | null;
    socialNetwork: string | null;
    notificationChannelPreference: number;
    notificationChannelPreferenceLabel: string;
    registeredAt: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    lockoutEnabled: boolean;
    lockoutEnd: string | null;
    accessFailedCount: number;
    twoFactorEnabled: boolean;
    roles: string[];
}

export interface UpdateUserDto {
    country: string | null;
    city: string | null;
    socialNetwork: string | null;
    phoneNumber: string | null;
    notificationChannelPreference: number;
}

export interface PagedList<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    items: T[];
}

export interface GetUsersRespond<T> {
    data: T;
    message: string;
}