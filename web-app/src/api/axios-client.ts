import Axios, { type AxiosError, type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5148";
const AUTH_ENDPOINTS = ["/Auth/login", "/Auth/register", "/Auth/refresh"];

let refreshRequest: Promise<void> | null = null;
let unauthorizedHandler: (() => void) | null = null;

function isAuthEndpoint(url: string | undefined): boolean {
    if (typeof url !== "string") {
        return false;
    }

    return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
}

async function refreshSession(): Promise<void> {
    if (refreshRequest !== null) {
        return refreshRequest;
    }

    refreshRequest = axiosClient
        .get("/Auth/refresh", {
            skipAuthRefresh: true,
        })
        .then(() => undefined)
        .finally(() => {
            refreshRequest = null;
        });

    return refreshRequest;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
    unauthorizedHandler = handler;
}

export const axiosClient = Axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
            originalRequest === undefined ||
            originalRequest.skipAuthRefresh === true ||
            error.response?.status !== 401 ||
            isAuthEndpoint(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        if (originalRequest._retry === true) {
            unauthorizedHandler?.();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            await refreshSession();
            return axiosClient(originalRequest);
        } catch (refreshError) {
            unauthorizedHandler?.();
            return Promise.reject(refreshError);
        }
    }
);

export default axiosClient;
