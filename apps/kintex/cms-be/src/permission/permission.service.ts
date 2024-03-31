// permission.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async createPermission(data: Prisma.PermissionCreateInput) {
    const { name } = data;
    const existingPermission = await this.prisma.permission.findFirst({
      where: { name },
    });

    if (existingPermission) {
      throw new ConflictException('Data already exist.');
    }
    return this.prisma.permission.create({ data });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getPermissionById(id: number) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async updatePermission(id: number, data: Prisma.PermissionUpdateInput) {
    return this.prisma.permission.update({ where: { id }, data });
  }

  async deletePermission(id: number) {
    return this.prisma.permission.delete({ where: { id } });
  }
}
