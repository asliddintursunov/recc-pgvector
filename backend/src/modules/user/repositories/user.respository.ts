import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/services/prisma.service";

@Injectable()
export class UserRepository {
    constructor(
        private readonly prismService: PrismaService
    ) { }

    async getById(id: string): Promise<User | null> {
        const user = await this.prismService.user.findFirst({
            where: { id }
        })

        return user ?? null
    }
}