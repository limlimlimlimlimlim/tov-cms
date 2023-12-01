// kiosk.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class KioskService {
  constructor(private prisma: PrismaService) {}

  async createKiosk(data: Prisma.KioskCreateInput) {
    return this.prisma.kiosk.create({
      data,
    });
  }

  async getKiosks({ keyword, page, count, floorId, wingId }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }
    if (floorId) {
      where.AND.push({ floorId: +floorId });
    }
    if (wingId) {
      where.AND.push({ wingId: +wingId });
    }

    const total = await this.prisma.kiosk.count({ where });
    const data = await this.prisma.kiosk.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        createdAt: true,
        updatedAt: true,
        floor: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
        wing: {
          select: {
            id: true,
            name: true,
            nameEn: true,
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

  async getKioskById(id: number) {
    return await this.prisma.kiosk.findUnique({
      where: { id },
    });
  }

  async getKioskByCode(code: string) {
    return await this.prisma.kiosk.findUnique({
      where: { code },
    });
  }

  async updateKiosk(id: number, data: Prisma.KioskUpdateInput) {
    const kiosk = await this.prisma.kiosk.findUnique({
      where: { id },
    });

    if (!kiosk) {
      throw new NotFoundException('Kiosk not found.');
    }

    return this.prisma.kiosk.update({
      where: { id },
      data,
    });
  }

  async deleteKiosk(id: number) {
    const kiosk = await this.prisma.kiosk.findUnique({
      where: { id },
    });

    if (!kiosk) {
      throw new NotFoundException('Kiosk not found.');
    }

    return await this.prisma.kiosk.delete({
      where: { id },
    });
  }
}
