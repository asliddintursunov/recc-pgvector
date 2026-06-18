
export type AuthRole = "customer" | "merchant";
export type AuthMode = "login" | "register"
export type UserRole = AuthRole | "admin";

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    role: UserRole;
}

export interface RegisterCredentials extends AuthCredentials {
    role: AuthRole;
}
