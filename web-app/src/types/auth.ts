export interface AuthUser {
    email: string;
    role: string;
    userName: string;
}

export interface LoginResponseBody {
    data: AuthUser;
    message: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    userName: string;
}


export interface GoogleAuthRequest {
    idToken: string;
}