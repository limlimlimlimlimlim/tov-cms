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
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: Prisma.UserCreateInput) {
    const sameUser = await this.userService.findOne(user.userId);
    if (sameUser) {
      throw new ConflictException('Data already exist.');
    }
    return this.userService.create(user);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  async findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    const sameUser = await this.userService.findOne(userId);
    if (!sameUser) {
      throw new NotFoundException('Data not found.');
    }
    return this.userService.update({ userId, data });
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    const sameUser = await this.userService.findOne(userId);
    if (!sameUser) {
      throw new NotFoundException('Data not found.');
    }
    return this.userService.remove(userId);
  }
}
