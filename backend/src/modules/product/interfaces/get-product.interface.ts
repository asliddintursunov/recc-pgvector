import { USER_ROLE } from "@prisma/client";

export interface GetProductInterfaceArgs {
    userId: string;
    userRole: USER_ROLE
}

export interface GetProductByIdInterfaceArgs extends GetProductInterfaceArgs {
    id: string;
}