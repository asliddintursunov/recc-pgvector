import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from 'src/shared/guards';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, RolesGuard],
  exports: [AuthService],
})
export class AuthModule { }
