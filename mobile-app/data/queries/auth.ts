import { axiosClient } from '@/api/axios-client';
import type {
  ApiResponse,
  AuthSession,
  LoginRequest,
  MobileAuthResponse,
  RegisterRequest,
} from '@/types/auth';

function mapAuthSession(response: MobileAuthResponse): AuthSession {
  return {
    tokens: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
  ***REMOVED***,
    user: {
      email: response.email,
      role: response.role,
      userName: response.userName,
  ***REMOVED***,
***REMOVED***;
}

export async function loginQuery(credentials: LoginRequest): Promise<AuthSession> {
  const response = await axiosClient.post<ApiResponse<MobileAuthResponse>>(
    '/Auth/login/mobile',
    credentials,
    {
      skipAuthRefresh: true,
  ***REMOVED***,
  );

  return mapAuthSession(response.data.data);
}

export async function refreshSessionQuery(refreshToken: string): Promise<AuthSession> {
  const response = await axiosClient.post<ApiResponse<MobileAuthResponse>>(
    '/Auth/refresh/mobile',
    {
      refreshToken,
  ***REMOVED***,
    {
      skipAuthRefresh: true,
  ***REMOVED***,
  );

  return mapAuthSession(response.data.data);
}

export async function registerQuery(request: RegisterRequest): Promise<void> {
  await axiosClient.post('/Auth/register', request, {
    skipAuthRefresh: true,
***REMOVED***);
}

export async function logoutQuery(): Promise<void> {
  await axiosClient.get('/Auth/logout');
}
