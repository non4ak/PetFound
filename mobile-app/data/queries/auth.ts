import { axiosClient } from '@/api/axios-client';
import type {
  ApiResponse,
  AuthSession,
  DeviceKeyRequest,
  GoogleLoginRequest,
  LoginRequest,
  MobileAuthResponse,
  RegisterRequest,
} from '@/types/auth';

function mapAuthSession(response: MobileAuthResponse): AuthSession {
  return {
    tokens: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
    user: {
      email: response.email,
      role: response.role,
      userName: response.userName,
    },
  };
}

export async function loginQuery(credentials: LoginRequest): Promise<AuthSession> {
  const response = await axiosClient.post<ApiResponse<MobileAuthResponse>>(
    '/Auth/login/mobile',
    credentials,
    {
      skipAuthRefresh: true,
    },
  );

  return mapAuthSession(response.data.data);
}

export async function googleLoginQuery(request: GoogleLoginRequest): Promise<AuthSession> {
  const response = await axiosClient.post<ApiResponse<MobileAuthResponse>>(
    '/Auth/google/mobile',
    request,
    {
      skipAuthRefresh: true,
    },
  );

  return mapAuthSession(response.data.data);
}

export async function refreshSessionQuery(refreshToken: string): Promise<AuthSession> {
  const response = await axiosClient.post<ApiResponse<MobileAuthResponse>>(
    '/Auth/refresh/mobile',
    {
      refreshToken,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return mapAuthSession(response.data.data);
}

export async function registerQuery(request: RegisterRequest): Promise<void> {
  await axiosClient.post('/Auth/register', request, {
    skipAuthRefresh: true,
  });
}

export async function logoutQuery(): Promise<void> {
  await axiosClient.get('/Auth/logout');
}

export async function updateDeviceKeyQuery(request: DeviceKeyRequest): Promise<void> {
  await axiosClient.put('/Auth/device-key', request);
}
