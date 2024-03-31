import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(data: Prisma.ScheduleUncheckedCreateInput) {
    const count = await this.prisma.schedule.count();
    data.order = count + 1;
    return this.prisma.schedule.create({
      data,
    });
  }

  async swapScheduleOrder(scheduleId1: number, scheduleId2: number) {
    const schedule1 = await this.prisma.schedule.findFirst({
      where: { id: scheduleId1 },
    });
    const schedule2 = await this.prisma.schedule.findFirst({
      where: { id: scheduleId2 },
    });

    const schedule1Order = schedule1.order;
    const schedule2Order = schedule2.order;

    return await this.prisma.$transaction([
      this.prisma.schedule.update({
        where: {
          id: scheduleId1,
        },
        data: {
          order: schedule2Order,
        },
      }),
      this.prisma.schedule.update({
        where: {
          id: scheduleId2,
        },
        data: {
          order: schedule1Order,
        },
      }),
    ]);
  }

  async updateOrderSchedule(id: number, displacement: number) {
    const schedule1 = await this.prisma.schedule.findFirst({
      where: { id: id },
    });
    const maxOrderSchedule = await this.prisma.schedule.findFirst({
      orderBy: {
        order: 'desc',
      },
    });
    const minOrderSchedule = await this.prisma.schedule.findFirst({
      orderBy: {
        order: 'asc',
      },
    });

    if (
      schedule1.order + displacement > maxOrderSchedule.order ||
      schedule1.order + displacement < minOrderSchedule.order
    ) {
      throw new InternalServerErrorException();
    }

    const schedule2 = await this.prisma.schedule.findFirst({
      where: { order: schedule1.order + displacement },
    });

    return await this.swapScheduleOrder(schedule1.id, schedule2.id);
  }

  async getSchedules({ keyword, page, count, startDate, endDate }) {
    const where = {
      AND: [],
    };
    if (keyword) {
      where.AND.push({ name: { contains: keyword } });
    }
    if (startDate && endDate) {
      const start = dayjs(startDate).add(9, 'h').startOf('day');
      const end = dayjs(endDate).add(9, 'h').endOf('day');
      where.AND.push({
        createdAt: {
          gte: start,
          lte: end,
        },
      });
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
        order: true,
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
        layout: true,
      },
      where: where,
      skip: (+page - 1) * +count,
      take: +count,
      orderBy: {
        order: 'desc',
      },
    });
    return { total, data, page, count };
  }

  async getScheduleById(id: number) {
    return await this.prisma.schedule.findUnique({
      where: { id },
    });
  }

  async getScheduleByOrder(order: number) {
    return await this.prisma.schedule.findFirst({
      where: { order },
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
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException('Schedule not found.');
    }

    const target = await this.prisma.schedule.findFirst({ where: { id } });
    const { wingId } = target;

    await this.prisma.schedule.delete({
      where: { id },
    });

    const reorderTargets = await this.prisma.schedule.findMany({
      where: {
        wingId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    let count = 0;
    for (const i of reorderTargets) {
      await this.prisma.schedule.update({
        where: {
          id: i.id,
        },
        data: {
          order: ++count,
        },
      });
    }
  }
}
