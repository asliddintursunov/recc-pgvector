import { Injectable } from "@nestjs/common";
import { User, USER_ROLE } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/services/prisma.service";
import { CreateMerchantArgs } from "../interfaces";

@Injectable()
export class UserRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getById(id: string): Promise<User | null> {
        const user = await this.prismaService.user.findFirst({
            where: { id }
        })

        return user ?? null
    }

    async switchToMerchant(args: CreateMerchantArgs): Promise<User> {
        return this.prismaService.$transaction(async (tx) => {
            await tx.merchant.upsert({
                where: { userId: args.userId },
                update: {},
                create: { userId: args.userId },
            });

            return tx.user.update({
                where: { id: args.userId },
                data: { role: USER_ROLE.merchant },
            });
        });
    }

    async switchToCustomer(userId: string): Promise<User> {
        return this.prismaService.user.update({
            where: { id: userId },
            data: { role: USER_ROLE.customer },
        });
    }
}
