export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    role: string;
}

export interface RegisterRequest {
    name: string;
    email: string,
    password: string;
    role?: string;
}

export interface RegisterResponse {
    message: string
}
