import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { getCurrentAuthSession } from '@/api/auth-session';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const AUTH_ENDPOINTS: readonly string[] = [
  '/Auth/login/mobile',
  '/Auth/register',
  '/Auth/refresh/mobile',
];

let refreshRequest: Promise<void> | null = null;
let refreshSessionHandler: (() => Promise<boolean>) | null = null;

function isAuthEndpoint(url: string | undefined): boolean {
  if (typeof url !== 'string') {
    return false;
  }

  return AUTH_ENDPOINTS.some((endpoint: string) => url.includes(endpoint));
}

function attachAccessToken(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const authSession = getCurrentAuthSession();
  const accessToken: string | undefined = authSession?.tokens.accessToken;

  if (typeof accessToken === 'string' && accessToken.length > 0) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}

async function refreshSession(): Promise<void> {
  if (refreshSessionHandler === null) {
    throw new Error('Auth refresh handler is not configured.');
  }

  if (refreshRequest !== null) {
    return refreshRequest;
  }

  refreshRequest = refreshSessionHandler()
    .then((hasRefreshedSession: boolean) => {
      if (!hasRefreshedSession) {
        throw new Error('Session refresh failed.');
      }
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

export function setAuthRefreshHandler(handler: (() => Promise<boolean>) | null): void {
  refreshSessionHandler = handler;
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return attachAccessToken(config);
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
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      return axiosClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default axiosClient;
