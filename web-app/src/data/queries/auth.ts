import axiosClient from "@/api/axios-client";
import type { SignInSchema, SignUpSchema } from "@/utils/validations/authSchema";
import type { LoginResponseBody, RegisterRequest } from "@/types/auth";

export async function loginQuery(data: SignInSchema) {
    const response = await axiosClient.post<LoginResponseBody>("/Auth/login", data, {
        skipAuthRefresh: true,
    });

    return response.data.data;
}

export async function registerQuery(data: SignUpSchema) {
    const requestBody: RegisterRequest = {
        email: data.email,
        password: data.password,
        userName: data.username,
    };

    return axiosClient.post("/Auth/register", requestBody, {
        skipAuthRefresh: true,
    });
}

export async function logoutQuery() {
    return axiosClient.get("/Auth/logout", {
        skipAuthRefresh: true,
    });
}

export async function refreshSessionQuery() {
    return axiosClient.get("/Auth/refresh", {
        skipAuthRefresh: true,
    });
}

export async function googleAuthQuery(idToken: string) {
    const response = await axiosClient.post<LoginResponseBody>("/Auth/google", { idToken }, {
        skipAuthRefresh: true,
    });

    return response.data.data;
}