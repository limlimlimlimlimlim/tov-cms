import {
  Body,
  Controller,
  Injectable,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
@Injectable()
export class AuthController {
  constructor(private users: UsersService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    const user = await this.users.findOne(dto.userId);
    if (!user || user.password !== dto.password) {
      throw new NotFoundException('Invalid username or password');
    }
    return { message: 'success', data: user };
  }
}
