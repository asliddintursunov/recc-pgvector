import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateInteractionArgs } from "../interfaces/create-interaction.interface";

@Injectable()
export class InteractionRepository {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async create(args: CreateInteractionArgs): Promise<boolean> {
        const interaction = await this.prismaService.interaction.create({
            data: {
                userId: args.userId,
                productId: args.productId,
                actionType: args.action,
            }
        })

        return !!interaction
    }
}
