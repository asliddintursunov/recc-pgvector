import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto, RegisterDto } from '../dtos';
import { Public } from 'src/shared/decorators';
import { LoginResponse, RegisterResponse } from '../interfaces';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<RegisterResponse> {

    await this.authService.register(body);

    return { message: 'User created successfully!' };
  }

  @Post("login")
  async login(@Body() body: AuthDto): Promise<LoginResponse> {

    return this.authService.login(body)
  }
}
