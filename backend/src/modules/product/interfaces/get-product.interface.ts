import { USER_ROLE } from "@prisma/client";

export interface GetProductArgs {
    userId: string;
    userRole: USER_ROLE
}

export interface GetProductByIdArgs extends GetProductArgs {
    id: string;
}