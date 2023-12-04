import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(data: Prisma.ScheduleUncheckedCreateInput) {
    return this.prisma.schedule.create({
      data,
    });
  }

  async getSchedules({ keyword, page, count, floorId, wingId }) {
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

    const total = await this.prisma.schedule.count({ where });
    const data = await this.prisma.schedule.findMany({
      select: {
        id: true,
        name: true,
        imageContents: true,
        videoContents: true,
        contentsType: true,
        createdAt: true,
        updatedAt: true,
        startDate: true,
        noPeriod: true,
        endDate: true,
        status: true,
        wing: {
          select: {
            id: true,
            name: true,
            nameEn: true,
          },
        },
        facility: {
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

  async getScheduleById(id: number) {
    return await this.prisma.schedule.findUnique({
      where: { id },
    });
  }

  async updateSchedule(id: number, data: Prisma.PostUpdateInput) {
    const post = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('schedule not found.');
    }

    return this.prisma.schedule.update({
      where: { id },
      data,
    });
  }

  async deleteSchedule(id: number) {
    const post = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Schedule not found.');
    }

    return await this.prisma.schedule.delete({
      where: { id },
    });
  }
}
