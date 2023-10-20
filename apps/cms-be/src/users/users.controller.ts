import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() user: Prisma.UserCreateInput) {
    return this.usersService.create(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update({ userId, data });
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }
}
