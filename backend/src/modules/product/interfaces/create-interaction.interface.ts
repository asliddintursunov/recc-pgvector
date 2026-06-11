import { INTERACTION_TYPE } from "@prisma/client";

export interface CreateInteractionArgs {
    userId: string,
    productId: string,
    action: INTERACTION_TYPE
}