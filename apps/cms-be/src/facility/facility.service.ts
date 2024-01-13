import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

const select = {
  id: true,
  name: true,
  phone: true,
  address: true,
  description: true,
  iconType: true,
  status: true,
  x: true,
  y: true,
  wingId: true,
  floorId: true,
  createdAt: true,
  updatedAt: true,
  tags: true,
  fontSize: true,
  iconColor: true,
  tooltipColor: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  subCategory: {
    select: {
      id: true,
      name: true,
    },
  },
  floor: {
    select: {
      id: true,
      name: true,
    },
  },
  wing: {
    select: {
      id: true,
      name: true,
    },
  },
  section: {
    select: {
      id: true,
      path: true,
      color: true,
      alpha: true,
      strokeColor: true,
      strokeAlpha: true,
      strokeWidth: true,
      facilities: true,
      group: {
        select: {
          id: true,
          sections: true,
        },
      },
    },
  },
};

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async createFacility(data: Prisma.FacilityCreateInput) {
    return this.prisma.facility.create({ data });
  }

  async getFacilities({ keyword, page, count, floorId, wingId }) {
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

    const total = await this.prisma.facility.count({ where });
    const data = await this.prisma.facility.findMany({
      select: select,
      where: where,
      skip: (+page - 1) * +count,
      take: +count,
      orderBy: {
        id: 'desc',
      },
    });
    return { total, data, page, count };
  }

  async getFacilityAll() {
    const total = await this.prisma.facility.count();
    const data = await this.prisma.facility.findMany({
      select: select,
      orderBy: {
        id: 'desc',
      },
    });
    return { total, data };
  }

  async getFacilityById(id: number) {
    const result = await this.prisma.facility.findUnique({
      select: select,
      where: { id },
    });

    const map = await this.prisma.map.findFirst({
      select: {
        id: true,
        image: true,
        sections: true,
      },
      where: {
        floorId: result.floorId,
        wingId: result.wingId,
      },
    });
    (result as any).map = map;
    return result;
  }

  async getFacilityByName(name: string) {
    return this.prisma.facility.findFirst({ where: { name } });
  }

  async updateFacility(id: number, data: Prisma.FacilityUpdateInput) {
    const facility = await this.prisma.facility.findUnique({
      where: { id },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found.');
    }

    return this.prisma.facility.update({
      where: { id },
      data,
    });
  }

  async deleteFacility(id: number) {
    const facility = await this.prisma.facility.findUnique({
      where: { id },
    });

    if (!facility) {
      throw new NotFoundException('Facility not found.');
    }

    return await this.prisma.facility.delete({
      where: { id },
    });
  }

  async createCategory(data: Prisma.FacilityCategoryCreateInput) {
    return this.prisma.facilityCategory.create({ data });
  }

  async createSubCategory(data: Prisma.FacilitySubCategoryCreateInput) {
    return this.prisma.facilitySubCategory.create({ data });
  }

  async getAllCategories() {
    return this.prisma.facilityCategory.findMany();
  }

  async getAllSubCategories() {
    return this.prisma.facilitySubCategory.findMany();
  }

  async getSubCategoriesByCategoryId(categoryId: number) {
    return this.prisma.facilitySubCategory.findMany({
      where: { categoryId },
    });
  }

  async getCategoryById(id: number) {
    return this.prisma.facilityCategory.findUnique({ where: { id } });
  }

  async getCategoryByName(name: string) {
    return this.prisma.facilityCategory.findFirst({ where: { name } });
  }

  async getSubCategoryById(id: number) {
    return this.prisma.facilitySubCategory.findUnique({ where: { id } });
  }

  async getSubCategoryByName(name: string) {
    return this.prisma.facilitySubCategory.findFirst({ where: { name } });
  }

  async updateCategory(id: number, data: Prisma.FacilityUpdateInput) {
    return this.prisma.facilityCategory.update({ where: { id }, data });
  }

  async updateSubCategory(
    id: number,
    data: Prisma.FacilitySubCategoryUpdateInput,
  ) {
    return this.prisma.facilitySubCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: number) {
    return this.prisma.facilityCategory.delete({ where: { id } });
  }

  async deleteSubCategory(id: number) {
    return this.prisma.facilitySubCategory.delete({ where: { id } });
  }
}
