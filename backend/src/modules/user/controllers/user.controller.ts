import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type User } from "@prisma/client";
import { Roles, RolesGuard } from "src/shared/guards";
import { GetUserParamDto } from "../dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Get("profile")
    async getProfile(
        @CurrentUser() user: User
    ) {
        return this.userService.getProfile(user.id);
    }

    @Get("customers")
    @Roles('admin')
    @UseGuards(RolesGuard)
    async getCustomers() {
        return this.userService.getCustomers();
    }

    @Get("merchants")
    @Roles('admin')
    @UseGuards(RolesGuard)
    async getMerchants() {
        return this.userService.getMerchants();
    }

    @Get(":id")
    @Roles('admin')
    @UseGuards(RolesGuard)
    async getById(
        @Param('id') id: GetUserParamDto['id']
    ) {
        return this.userService.getProfile(id);
    }
}
