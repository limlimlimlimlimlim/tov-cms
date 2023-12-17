import {
  Body,
  Controller,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(
    private user: UserService,
    private auth: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() userInfo: { userId: string; password: string }) {
    const user = await this.user.findOne(userInfo.userId);
    if (!user || user.password !== userInfo.password) {
      throw new NotFoundException('Invalid username or password');
    }
    const token = await this.auth.signPayload({ id: user.userId });
    return { message: 'success', name: user.name, token };
  }

  @Post('/verify-token')
  async verifyToken(@Body() { token }: any) {
    console.log(token);
    return this.auth.verifyToken(token);
  }
}
