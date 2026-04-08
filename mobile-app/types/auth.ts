export interface AuthUser {
  email: string;
  role: string;
  userName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthSession {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  userName: string;
}

export interface ApiResponse<TData> {
  data: TData;
  message: string;
}

export interface ApiProblemDetails {
  detail?: string;
  status?: number;
  title?: string;
  type?: string;
}

export interface MobileAuthResponse {
  accessToken: string;
  email: string;
  refreshToken: string;
  role: string;
  userName: string;
}
