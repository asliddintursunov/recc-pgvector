import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos';
import { Public } from 'src/shared/decorators';
import { LoginResponse, RegisterResponse } from '../interfaces';
import { USER_ROLE } from '@prisma/client';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register/customer')
  async registerCustomer(@Body() body: RegisterDto): Promise<RegisterResponse> {

    await this.authService.register({
      ...body,
      role: USER_ROLE.customer
    });

    return { message: 'Customer created successfully!' };
  }

  @Post('register/merchant')
  async registerMerchant(@Body() body: RegisterDto): Promise<RegisterResponse> {

    await this.authService.register({
      ...body,
      role: USER_ROLE.merchant
    });

    return { message: 'Merchant created successfully!' };
  }

  @Post("login")
  async login(@Body() body: LoginDto): Promise<LoginResponse> {

    return this.authService.login(body)
  }
}
