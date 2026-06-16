import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/services/prisma.service";

@Injectable()
export class PurchaseRepository {
    constructor(private readonly prismaService: PrismaService) { }
}