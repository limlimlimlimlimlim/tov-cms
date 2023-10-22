import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FacilityService {
  constructor(private prisma: PrismaService) {}

  async createFacility(data: Prisma.FacilityCreateInput) {
    return this.prisma.facility.create({ data });
  }

  async getAllFacilities() {
    return this.prisma.facility.findMany();
  }

  async getFacilityById(id: number) {
    return this.prisma.facility.findUnique({ where: { id } });
  }

  async getFacilityByName(name: string) {
    return this.prisma.facility.findFirst({ where: { name } });
  }

  async updateFacility(id: number, data: Prisma.FacilityUpdateInput) {
    return this.prisma.facility.update({ where: { id }, data });
  }

  async deleteFacility(id: number) {
    return this.prisma.facility.delete({ where: { id } });
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
      where: { parentId: categoryId },
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
