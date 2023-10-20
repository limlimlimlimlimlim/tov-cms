import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(userId: string) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  async update(params: { userId: string; data: Prisma.UserUpdateInput }) {
    const { userId, data } = params;
    return this.prisma.user.update({
      data,
      where: { userId },
    });
  }

  async remove(userId: string) {
    return this.prisma.user.delete({ where: { userId } });
  }
}
