
export type AuthRole = "customer" | "merchant";
export type AuthMode = "login" | "register"

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials extends AuthCredentials {
    role: AuthRole;
}
