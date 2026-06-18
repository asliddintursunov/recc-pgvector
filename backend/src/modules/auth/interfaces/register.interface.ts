import { USER_ROLE } from "@prisma/client";

export interface CreateUserArgs {
    username: string;
    password: string;
    role: USER_ROLE;
}

export interface RegisterResponse {
    message: string;
}
