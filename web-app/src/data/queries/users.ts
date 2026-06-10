import axiosClient from "@/api/axios-client";
import type { GetUsers } from "@/types/users";
import type { UserDto } from "@/types/users";
import type { PagedList } from "@/types/users";
import type { GetUsersRespond } from "@/types/users";

export async function getAllUsers(params: GetUsers) {
    /*const requestBody: GetUsers = {
        search: params.search,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
    };*/

    const response = await axiosClient.get<GetUsersRespond<PagedList<UserDto>>>("/admin/users", {params: {search: params.search, pageNumber: params.pageNumber, pageSize: params.pageSize}});

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