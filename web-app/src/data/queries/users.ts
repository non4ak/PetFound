import axiosClient from "@/api/axios-client";
import type { GetUsers, UserDto, FullUserDto, UpdateUserDto, PagedList, GetUsersRespond } from "@/types/users";

export async function getAllUsers(params: GetUsers) {
    const response = await axiosClient.get<GetUsersRespond<PagedList<UserDto>>>("/admin/users", {
        params: { search: params.search, pageNumber: params.pageNumber, pageSize: params.pageSize },
    });
    return response.data.data;
}

export async function getUserById(id: number) {
    const response = await axiosClient.get<GetUsersRespond<FullUserDto>>(`/admin/users/${id}`);
    return response.data.data;
}

export async function updateUser(id: number, dto: UpdateUserDto) {
    const response = await axiosClient.put<GetUsersRespond<FullUserDto>>(`/admin/users/${id}`, dto);
    return response.data.data;
}

export async function deactivateUser(id: number) {
    return await axiosClient.post(`/admin/users/${id}/deactivate`);
}

export async function activateUser(id: number) {
    return await axiosClient.post(`/admin/users/${id}/activate`);
}

export async function deleteUser(id: number) {
    return await axiosClient.delete(`/admin/users/${id}`);
}