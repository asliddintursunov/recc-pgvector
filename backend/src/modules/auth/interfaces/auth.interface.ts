import { USER_ROLE } from "@prisma/client";

export interface AuthArgs {
    username: string;
    password: string;
}

export interface RegisterArgs extends AuthArgs {
    merchantIntent?: boolean;
}

export interface CreateUserArgs extends AuthArgs {
    role: USER_ROLE;
}
