import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos';
import { Public } from 'src/shared/decorators';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: AuthDto): Promise<{ message: string }> {

    const { username, password } = body
    await this.authService.register(username, password);

    return { message: 'User created successfully!' };
  }

  @Post("login")
  async login(@Body() body: AuthDto): Promise<{ accessToken: string }> {
    const { username, password } = body

    return this.authService.login(username, password)
  }
}
