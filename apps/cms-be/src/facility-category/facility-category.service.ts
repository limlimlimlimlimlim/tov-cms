import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FacilityCategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: Prisma.FacilityCategoryUncheckedCreateInput) {
    return this.prisma.facilityCategory.create({ data });
  }

  async createSubCategory(
    data: Prisma.FacilitySubCategoryUncheckedCreateInput,
  ) {
    return this.prisma.facilitySubCategory.create({ data });
  }

  async getFacilityCategoryTree() {
    return await this.prisma.facilityCategory.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        subCategories: true,
      },
    });
  }

  async getAllCategories() {
    return this.prisma.facilityCategory.findMany();
  }

  async getAllSubCategories() {
    return this.prisma.facilitySubCategory.findMany();
  }

  async getSubCategoryById(id: string) {
    return this.prisma.facilitySubCategory.findUnique({ where: { id: +id } });
  }

  async getCategoryById(id: string) {
    return this.prisma.facilityCategory.findUnique({ where: { id: +id } });
  }

  async getCategoryInSub(categoryId: string) {
    return await this.prisma.facilitySubCategory.findMany({
      where: { categoryId: +categoryId },
    });
  }

  async updateCategory(id: string, data: Prisma.FacilityCategoryUpdateInput) {
    return this.prisma.facilityCategory.update({ where: { id: +id }, data });
  }

  async updateSubCategory(
    id: number,
    data: Prisma.FacilitySubCategoryUpdateInput,
  ) {
    return this.prisma.facilitySubCategory.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    return this.prisma.facilityCategory.delete({ where: { id: +id } });
  }

  async deleteSubCategory(id: string) {
    return this.prisma.facilitySubCategory.delete({ where: { id: +id } });
  }
}
