import { USER_ROLE } from "@prisma/client";

export interface LoginResponse {
    accessToken: string;
    role: USER_ROLE;
}

export interface LoginArgs {
    username: string;
    password: string;
}
