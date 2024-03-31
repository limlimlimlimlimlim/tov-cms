import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BuildingInfoService {
  constructor(private prisma: PrismaService) {}

  async createFloor(data: Prisma.FloorUncheckedCreateInput) {
    if (data.order !== undefined) {
      await this.prisma.floor.updateMany({
        where: {
          order: {
            gte: data.order,
          },
        },
        data: {
          order: { increment: 1 },
        },
      });
    } else {
      const count = await this.prisma.floor.count({
        where: {
          wingId: data.wingId,
        },
      });
      data.order = count + 1;
    }
    return this.prisma.floor.create({ data });
  }

  async createWing(data: Prisma.WingUncheckedCreateInput) {
    return this.prisma.wing.create({ data });
  }

  async getWingFloorTree() {
    return await this.prisma.wing.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        floors: {
          select: {
            id: true,
            name: true,
            order: true,
            wingId: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            order: 'desc',
          },
        },
      },
    });
  }

  async getAllFloors() {
    return this.prisma.floor.findMany();
  }

  async getAllWings() {
    return this.prisma.wing.findMany();
  }

  async getFloorById(id: string) {
    return this.prisma.floor.findUnique({ where: { id: +id } });
  }

  async getWingById(id: string) {
    return this.prisma.wing.findUnique({ where: { id: +id } });
  }

  async getFloorsInWing(wingId: string) {
    return this.prisma.floor.findMany({
      where: { wingId: +wingId },
    });
  }

  async getWingsInFloor(wingId: string) {
    return await this.prisma.floor.findMany({
      where: { wingId: +wingId },
    });
  }

  async getFloorByName(name: string, lang: 'ko' | 'en') {
    return this.prisma.floor.findFirst({
      where: { [lang === 'ko' ? 'name' : 'nameEn']: name },
    });
  }

  async getWingByName(name: string) {
    return this.prisma.wing.findFirst({ where: { name } });
  }

  async getFloorCount() {
    return this.prisma.floor.count();
  }

  async updateFloor(id: string, data: Prisma.FloorUpdateInput) {
    return this.prisma.floor.update({ where: { id: +id }, data });
  }

  async updateWing(id: number, data: Prisma.WingUpdateInput) {
    return this.prisma.wing.update({ where: { id }, data });
  }

  async deleteFloor(id: string) {
    const floor = await this.getFloorById(id);
    const order = floor.order;
    await this.prisma.floor.updateMany({
      where: {
        wingId: floor.wingId,
        order: {
          gt: order,
        },
      },
      data: {
        order: { decrement: 1 },
      },
    });
    return this.prisma.floor.delete({ where: { id: +id } });
  }

  async deleteWing(id: string) {
    return this.prisma.wing.delete({ where: { id: +id } });
  }

  async swapFloors(id1: string, id2: string) {
    const floor1 = await this.getFloorById(id1);
    const floor2 = await this.getFloorById(id2);

    return Promise.all([
      this.prisma.floor.update({
        where: { id: +id1 },
        data: { order: floor2.order },
      }),
      this.prisma.floor.update({
        where: { id: +id2 },
        data: { order: floor1.order },
      }),
    ]);
  }

  async updateFloorOrder(wingId: number, floorId, displacement: number) {
    const floor1 = await this.prisma.floor.findFirst({
      where: { id: floorId },
    });
    const maxFloorOrder = await this.prisma.floor.findFirst({
      where: {
        wingId,
      },
      orderBy: {
        order: 'desc',
      },
    });
    const minFloorOrder = await this.prisma.floor.findFirst({
      where: {
        wingId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    if (
      floor1.order + displacement > maxFloorOrder.order ||
      floor1.order + displacement < minFloorOrder.order
    ) {
      throw new InternalServerErrorException();
    }

    const floor2 = await this.prisma.floor.findFirst({
      where: { order: floor1.order + displacement },
    });

    return await this.swapFloorOrder(floor1.id, floor2.id);
  }

  async swapFloorOrder(floorId1: number, floorId2: number) {
    const floor1 = await this.prisma.floor.findFirst({
      where: { id: floorId1 },
    });
    const floor2 = await this.prisma.floor.findFirst({
      where: { id: floorId2 },
    });

    const floor1Order = floor1.order;
    const floor2Order = floor2.order;

    return await this.prisma.$transaction([
      this.prisma.floor.update({
        where: {
          id: floorId1,
        },
        data: {
          order: floor2Order,
        },
      }),
      this.prisma.floor.update({
        where: {
          id: floorId2,
        },
        data: {
          order: floor1Order,
        },
      }),
    ]);
  }
}
