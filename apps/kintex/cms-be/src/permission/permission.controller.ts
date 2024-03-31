// permission.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Prisma } from '@prisma/client';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(@Body() data: Prisma.PermissionCreateInput) {
    return this.permissionService.createPermission(data);
  }

  @Get()
  async getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }

  @Get(':id')
  async getPermissionById(@Param('id') id: string) {
    return this.permissionService.getPermissionById(+id);
  }

  @Patch(':id')
  async updatePermission(
    @Param('id') id: number,
    @Body() data: Prisma.PermissionUpdateInput,
  ) {
    return this.permissionService.updatePermission(+id, data);
  }

  @Delete(':id')
  async deletePermission(@Param('id') id: number) {
    return this.permissionService.deletePermission(+id);
  }
}
