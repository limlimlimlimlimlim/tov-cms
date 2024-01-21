import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async getUsers({ keyword, page, count }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }

    const total = await this.prisma.user.count({ where });
    const data = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        permission: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: where,
      skip: (+page - 1) * +count,
      take: +count,
      orderBy: {
        id: 'desc',
      },
    });
    return { total, data, page, count };
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
