// src/facility/facility.controller.ts

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ConflictException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { FacilityService } from './facility.service';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post('category')
  async createCategory(@Body() data: { name: string }) {
    const sameCategory = await this.getCategoryByName(data.name);
    console.log(sameCategory);
    if (sameCategory) {
      throw new ConflictException('Data already exist.');
    }
    return await this.facilityService.createCategory(data);
  }

  @Post('sub-category')
  async createSubCategory(@Body() data: { name: string; parentId: number }) {
    const sameCategory = await this.getSubCategoryByName(data.name);
    if (sameCategory && sameCategory.parentId == data.parentId) {
      throw new ConflictException('Data already exist.');
    }
    return await this.facilityService.createSubCategory(data);
  }

  @Get('categories')
  async getAllCategories() {
    const categories = await this.facilityService.getAllCategories();
    const subCategories = await this.facilityService.getAllSubCategories();
    const result = categories.map((category) => {
      const childCategories = subCategories.find((subCategory) => {
        return subCategory.parentId === category.id;
      });
      return { ...category, child: childCategories || [] };
    });
    return result;
  }

  @Get('sub-categories')
  async getAllSubCategories() {
    return this.facilityService.getAllSubCategories();
  }

  @Get('category/:id')
  async getCategoryById(@Param('id') id: number) {
    return await this.facilityService.getCategoryById(+id);
  }

  @Get('category/name/:name')
  async getCategoryByName(@Param('name') name: string) {
    return await this.facilityService.getCategoryByName(name);
  }

  @Get('sub-category/:id')
  async getSubCategoryById(@Param('id') id: number) {
    return await this.facilityService.getSubCategoryById(+id);
  }

  @Get('sub-category/name/:name')
  async getSubCategoryByName(@Param('name') name: string) {
    return await this.facilityService.getSubCategoryByName(name);
  }

  @Patch('category/:id')
  async updateCategory(
    @Param('id') id: number,
    @Body() data: { name: string },
  ) {
    const sameCategory = await this.getCategoryById(+id);
    if (!sameCategory) {
      throw new NotFoundException('Data not found.');
    }
    return this.facilityService.updateCategory(+id, data);
  }

  @Patch('sub-category/:id')
  async updateSubCategory(
    @Param('id') id: number,
    @Body() data: { name: string; parentId: number },
  ) {
    const sameCategory = await this.getSubCategoryById(+id);
    if (!sameCategory) {
      throw new NotFoundException('Data not found.');
    }
    return this.facilityService.updateSubCategory(+id, data);
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: number) {
    const sameCategory = await this.getCategoryById(+id);
    if (!sameCategory) {
      throw new NotFoundException('Data not found.');
    }
    return this.facilityService.deleteCategory(+id);
  }

  @Delete('sub-category/:id')
  async deleteSubCategory(@Param('id') id: number) {
    const sameCategory = await this.getSubCategoryById(+id);
    if (!sameCategory) {
      throw new NotFoundException('Data not found.');
    }
    return this.facilityService.deleteSubCategory(+id);
  }
}
