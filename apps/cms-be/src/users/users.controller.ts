import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  NotFoundException,
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
    const sameUser = await this.usersService.findOne(user.userId);
    if (sameUser) {
      throw new ConflictException('Data already exist.');
    }
    return this.usersService.create(user);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    const sameUser = await this.usersService.findOne(userId);
    if (!sameUser) {
      throw new NotFoundException('Data not found.');
    }
    return this.usersService.update({ userId, data });
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    const sameUser = await this.usersService.findOne(userId);
    if (!sameUser) {
      throw new NotFoundException('Data not found.');
    }
    return this.usersService.remove(userId);
  }
}
