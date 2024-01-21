import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [UserService, AuthService, PrismaService],
})
export class AuthModule {}
