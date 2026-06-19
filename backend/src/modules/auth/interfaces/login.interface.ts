import { USER_ROLE } from "@prisma/client";

export interface LoginResponse {
    accessToken: string;
}

export interface LoginArgs {
    username: string;
    password: string;
}
