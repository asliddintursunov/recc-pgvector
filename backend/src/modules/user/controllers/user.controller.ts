import { Controller, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CurrentUser } from "src/shared/decorators/current-user.decorator";
import { type User } from "@prisma/client";

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post("merchant")
    async switchToMerchant(
        @CurrentUser() user: User
    ) {
        return this.userService.switchToMerchant({
            userId: user.id,
        });
    }

    @Post("customer")
    async switchToCustomer(
        @CurrentUser() user: User
    ) {
        return this.userService.switchToCustomer(user.id);
    }
}
