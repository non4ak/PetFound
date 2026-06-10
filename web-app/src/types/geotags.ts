export interface GeotagDto {
    id: number;
    title: string;
    description: string;
    category: number;
    categoryLabel: string;
    latitude: number | null;
    longitude: number | null;
    address: string;
    photoUrl: string | null;
    createdByUserId: number;
    createdOn: string;
}

export interface GetGeotagsParams {
    search?: string;
    category?: number;
    minLatitude?: number;
    maxLatitude?: number;
    minLongitude?: number;
    maxLongitude?: number;
    pageNumber?: number;
    pageSize?: number;
}

export interface CreateGeotagDto {
    title: string;
    description: string;
    category: number;
    latitude: number | null;
    longitude: number | null;
    address: string;
    photoUrl: string | null;
}

export interface PagedGeotagsResponse {
    items: GeotagDto[];
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

export interface GeotagResponse<T> {
    data: T;
    message: string;
}