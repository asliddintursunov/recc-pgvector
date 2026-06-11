import { Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.respository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    exports: [UserRepository],
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule { }
