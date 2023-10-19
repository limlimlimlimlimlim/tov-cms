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

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(params: { id: number; data: Prisma.UserUpdateInput }) {
    const { id, data } = params;
    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
