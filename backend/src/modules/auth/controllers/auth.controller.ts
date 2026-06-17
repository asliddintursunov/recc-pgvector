import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos';
import { Public } from 'src/shared/decorators';
import { LoginInterfaceResponse, RegisterInterfaceResponse } from '../interfaces';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: AuthDto): Promise<RegisterInterfaceResponse> {

    await this.authService.register(body);

    return { message: 'User created successfully!' };
  }

  @Post("login")
  async login(@Body() body: AuthDto): Promise<LoginInterfaceResponse> {

    return this.authService.login(body)
  }
}
