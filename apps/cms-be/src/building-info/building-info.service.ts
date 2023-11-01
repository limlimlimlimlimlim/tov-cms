import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BuildingInfoService {
  constructor(private prisma: PrismaService) {}

  async createFloor(data: Prisma.FloorCreateInput) {
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
    }
    return this.prisma.floor.create({ data });
  }

  async addWingToFloor(data: Prisma.WingOnFloorUncheckedCreateInput) {
    if (data.order !== undefined) {
      await this.prisma.wingOnFloor.updateMany({
        where: {
          floorId: data.floorId,
          order: {
            gte: data.order,
          },
        },
        data: {
          order: { increment: 1 },
        },
      });
    } else {
      const count = await this.getFloorCountFromWingOnFloor(
        data.floorId.toString(),
      );
      data.order = count;
    }
    return this.prisma.wingOnFloor.create({ data });
  }

  async getFloorCountFromWingOnFloor(floorId: string) {
    return this.prisma.wingOnFloor.count({ where: { floorId: +floorId } });
  }

  async createWing(data: Prisma.WingUncheckedCreateInput) {
    return this.prisma.wing.create({ data });
  }

  async getFloorWingTree() {
    const floors = await this.prisma.floor.findMany({
      orderBy: { order: 'asc' },
    });
    const tree = [];
    for (const floor of floors) {
      const floorId = floor.id;

      if (
        !tree.find((i) => {
          i.id == floorId;
        })
      ) {
        tree.push({
          ...floor,
          wings: await this.getWingsInFloor(floorId.toString()),
        });
      }
    }
    return tree;
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

  async getWingsInFloor(floorId: string) {
    const wingOnFloorData = await this.prisma.wingOnFloor.findMany({
      where: { floorId: +floorId },
      include: { wing: true },
    });

    return wingOnFloorData.map((item) => ({
      id: item.wing.id,
      name: item.wing.name,
      nameEn: item.wing.nameEn,
      createdAt: item.wing.createdAt,
      updatedAt: item.wing.updatedAt,
      order: item.order,
    }));
  }

  async hasAddedWing(floorId: string) {
    const floor = await this.prisma.wingOnFloor.findFirst({
      where: { floorId: +floorId },
    });

    return !!floor;
  }

  async isAddedWing(wingId: string) {
    const wing = await this.prisma.wingOnFloor.findFirst({
      where: { wingId: +wingId },
    });

    return !!wing;
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
    await this.prisma.floor.delete({ where: { id: +id } });
    return this.prisma.floor.updateMany({
      where: { order: { gte: order } },
      data: { order: { decrement: 1 } },
    });
  }

  async deleteWing(id: string) {
    return this.prisma.wing.delete({ where: { id: +id } });
  }

  async deleteWingInFloor(floorId: string, wingId: string) {
    const wing = await this.prisma.wingOnFloor.findUnique({
      where: {
        wingId_floorId: {
          floorId: +floorId,
          wingId: +wingId,
        },
      },
    });
    const order = wing.order;

    await this.prisma.wingOnFloor.delete({
      where: {
        wingId_floorId: {
          floorId: +floorId,
          wingId: +wingId,
        },
      },
    });
    return await this.prisma.wingOnFloor.updateMany({
      where: {
        floorId: +floorId,
        order: { gte: order },
      },
      data: { order: { decrement: 1 } },
    });
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

  async swapWings(floorId: string, id1: string, id2: string) {
    const wings = await this.getWingsInFloor(floorId);
    const wing1 = wings.find((wing) => wing.id.toString() === id1);
    const wing2 = wings.find((wing) => wing.id.toString() === id2);

    return Promise.all([
      this.prisma.wingOnFloor.update({
        where: {
          wingId_floorId: {
            floorId: +floorId,
            wingId: wing1.id,
          },
        },
        data: { order: wing2.order },
      }),
      this.prisma.wingOnFloor.update({
        where: {
          wingId_floorId: {
            floorId: +floorId,
            wingId: wing2.id,
          },
        },
        data: { order: wing1.order },
      }),
    ]);
  }
}
