import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { CreateUserArgs } from '../interfaces';

@Injectable()
export class AuthRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async getByUsername(username: string): Promise<User | null> {
        return await this.prismaService.user.findFirst({ where: { username } })
    }

    async create(data: CreateUserArgs): Promise<User | null> {
        return await this.prismaService.user.create({ data })
    }
}
