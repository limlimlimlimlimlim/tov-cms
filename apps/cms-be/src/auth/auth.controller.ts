import {
  Body,
  Controller,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private user: UserService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const user = await this.user.findOne(dto.userId);
    if (!user || user.password !== dto.password) {
      throw new NotFoundException('Invalid username or password');
    }
    return { message: 'success', data: user };
  }
}
