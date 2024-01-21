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
  Query,
} from '@nestjs/common';
import { FacilityService } from './facility.service';
import { Prisma } from '@prisma/client';

@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Post()
  async createFacility(@Body() data: Prisma.FacilityCreateInput) {
    return await this.facilityService.createFacility(data);
  }

  @Get()
  async getFacilities(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('floorId') floorId: string,
    @Query('wingId') wingId: string,
  ) {
    return this.facilityService.getFacilities({
      keyword,
      page,
      count,
      floorId,
      wingId,
    });
  }

  @Get('all')
  async getFacilityAll() {
    return this.facilityService.getFacilityAll();
  }

  @Get(':id')
  async getFacilityById(@Param('id') id: string) {
    const facility = await this.facilityService.getFacilityById(+id);
    if (!facility) {
      throw new NotFoundException('Facility not found.');
    }
    return facility;
  }

  @Patch(':id')
  async updateFacility(
    @Param('id') id: number,
    @Body() data: Prisma.FacilityUpdateInput,
  ) {
    const sameFacility = await this.facilityService.getFacilityById(+id);
    if (!sameFacility) {
      throw new NotFoundException('Facility not found.');
    }
    return this.facilityService.updateFacility(+id, data);
  }

  @Delete(':id')
  async deleteFacility(@Param('id') id: number) {
    const sameFacility = await this.facilityService.getFacilityById(+id);
    if (!sameFacility) {
      throw new NotFoundException('Facility not found.');
    }
    return this.facilityService.deleteFacility(+id);
  }

  @Post('category')
  async createCategory(@Body() data: Prisma.FacilityCategoryCreateInput) {
    const sameCategory = await this.getCategoryByName(data.name);
    if (sameCategory) {
      throw new ConflictException('Data already exist.');
    }
    return await this.facilityService.createCategory(data);
  }

  @Post('sub-category')
  async createSubCategory(@Body() data: Prisma.FacilitySubCategoryCreateInput) {
    const sameCategory = await this.getSubCategoryByName(data.name);
    if (sameCategory && sameCategory.categoryId == data.category.connect.id) {
      throw new ConflictException('Data already exist.');
    }
    return await this.facilityService.createSubCategory(data);
  }

  @Get('category-tree')
  async getAllCategorTree() {
    const categories = await this.facilityService.getAllCategories();
    const subCategories = await this.facilityService.getAllSubCategories();
    const result = categories.map((category) => {
      const childCategories = subCategories.filter((subCategory) => {
        return subCategory.categoryId === category.id;
      });
      return { ...category, child: childCategories || [] };
    });
    return result;
  }

  @Get('categories')
  async getAllCategories() {
    return await this.facilityService.getAllCategories();
  }

  @Get('sub-categories')
  async getAllSubCategories() {
    return this.facilityService.getAllSubCategories();
  }

  @Get('sub-categories/:categoryId')
  async getSubCategoriesByCategoryId(@Param('categoryId') categoryId: number) {
    return await this.facilityService.getSubCategoriesByCategoryId(+categoryId);
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
    @Body() data: Prisma.FacilityCategoryUpdateInput,
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
    @Body() data: Prisma.FacilitySubCategoryUpdateInput,
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

    const child = await this.getSubCategoriesByCategoryId(+id);

    if (child && child.length > 0) {
      throw new ConflictException('Data deletion failed due to dependencies.');
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
