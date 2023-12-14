import { Injectable } from '@nestjs/common';
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
        nameEn: true,
        createdAt: true,
        updatedAt: true,
        floors: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            order: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            order: 'asc',
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

  // async swapWings(floorId: string, id1: string, id2: string) {
  // const wings = await this.getWingsInFloor(floorId);
  // const wing1 = wings.find((wing) => wing.id.toString() === id1);
  // const wing2 = wings.find((wing) => wing.id.toString() === id2);
  // return Promise.all([
  //   this.prisma.wingOnFloor.update({
  //     where: {
  //       wingId_floorId: {
  //         floorId: +floorId,
  //         wingId: wing1.id,
  //       },
  //     },
  //     data: { order: wing2.order },
  //   }),
  //   this.prisma.wingOnFloor.update({
  //     where: {
  //       wingId_floorId: {
  //         floorId: +floorId,
  //         wingId: wing2.id,
  //       },
  //     },
  //     data: { order: wing1.order },
  //   }),
  // ]);
  // }
}
