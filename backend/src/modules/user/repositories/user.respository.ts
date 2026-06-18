import { Injectable } from "@nestjs/common";
import { User, USER_ROLE } from "@prisma/client";
import { PrismaService } from "src/modules/prisma/services/prisma.service";

const userProfileSelect = {
    id: true,
    username: true,
    role: true,
    createdAt: true,
} as const;

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

    async getProfile(id: string) {
        return this.prismaService.user.findFirst({
            where: { id },
            select: userProfileSelect,
        });
    }

    async getByRole(role: USER_ROLE) {
        return this.prismaService.user.findMany({
            where: { role },
            select: userProfileSelect,
        });
    }
}
