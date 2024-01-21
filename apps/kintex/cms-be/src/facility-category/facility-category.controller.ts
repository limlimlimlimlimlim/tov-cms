import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FacilityCategoryService } from './facility-category.service';
import { Prisma } from '@prisma/client';

@Controller('facility-category')
export class FacilityCategoryController {
  constructor(
    private readonly facilityCategoryService: FacilityCategoryService,
  ) {}

  @Post('category')
  async createCategory(
    @Body() data: Prisma.FacilityCategoryUncheckedCreateInput,
  ) {
    return await this.facilityCategoryService.createCategory(data);
  }

  @Post('sub-category')
  async createSubCategory(
    @Body() data: Prisma.FacilitySubCategoryUncheckedCreateInput,
  ) {
    return await this.facilityCategoryService.createSubCategory(data);
  }

  @Get('tree')
  async getFacilityCategoryTree() {
    return await this.facilityCategoryService.getFacilityCategoryTree();
  }

  @Get('categories')
  async getAllCategory() {
    return await this.facilityCategoryService.getAllCategories();
  }

  @Get('sub-category')
  async getAllSubCategory() {
    return await this.facilityCategoryService.getAllSubCategories();
  }

  @Get('sub-category')
  async createSubCategoey() {
    return await this.facilityCategoryService.getAllSubCategories();
  }

  @Get('category/:id/subs')
  async getCategoryInSub(@Param('id') id: string) {
    return await this.facilityCategoryService.getCategoryInSub(id);
  }

  @Patch('category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() data: Prisma.FacilityCategoryUpdateInput,
  ) {
    return this.facilityCategoryService.updateCategory(id, data);
  }

  @Patch('sub-category/:id')
  async updateSubCategory(
    @Param('id') id: string,
    @Body() data: Prisma.FacilitySubCategoryUpdateInput,
  ) {
    return this.facilityCategoryService.updateSubCategory(+id, data);
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.facilityCategoryService.deleteCategory(id);
  }

  @Delete('sub-category/:wingId')
  async deleteSubCategory(@Param('wingId') wingId: string) {
    return this.facilityCategoryService.deleteSubCategory(wingId);
  }
}
