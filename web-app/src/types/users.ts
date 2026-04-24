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
    phoneNumber: number | null;
    socialNetwork: string | null;
    notificationChannelPreference: number | null;
    registeredAt: string;
    isDeactivated: boolean;
    lockoutEnd: string;
    roles: string;
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