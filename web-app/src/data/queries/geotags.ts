import axiosClient from "@/api/axios-client";
import type { GeotagDto, CreateGeotagDto, GetGeotagsParams, PagedGeotagsResponse, GeotagResponse } from "@/types/geotags";

export async function getGeotags(params?: GetGeotagsParams) {
    const response = await axiosClient.get<GeotagResponse<PagedGeotagsResponse>>("/geotags", { params });
    return response.data.data;
}

export async function getGeotagById(id: number) {
    const response = await axiosClient.get<GeotagResponse<GeotagDto>>(`/geotags/${id}`);
    return response.data.data;
}

export async function createGeotag(dto: CreateGeotagDto) {
    const response = await axiosClient.post<GeotagResponse<GeotagDto>>("/geotags", dto);
    return response.data.data;
}

export async function updateGeotag(id: number, dto: CreateGeotagDto) {
    const response = await axiosClient.put<GeotagResponse<GeotagDto>>(`/geotags/${id}`, dto);
    return response.data.data;
}

export async function deleteGeotag(id: number) {
    await axiosClient.delete(`/geotags/${id}`);
}