import { Controller, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';

@Injectable()
export class AuthRepository {
    constructor(private readonly prismService: PrismaService) { }

    async getByUsername(username: string): Promise<User | null> {
        return await this.prismService.user.findFirst({ where: { username } })
    }

    async create(username: string, password: string): Promise<User | null> {
        return await this.prismService.user.create({ data: { username, password } })
    }
}
