// kiosk.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { KioskService } from './kiosk.service';
import { Kiosk, Prisma } from '@prisma/client';

@Controller('kiosk')
export class KioskController {
  constructor(private readonly kioskService: KioskService) {}

  @Post()
  async createKiosk(@Body() data: Prisma.KioskCreateInput): Promise<Kiosk> {
    return this.kioskService.createKiosk(data);
  }

  @Get()
  async getKiosks(
    @Query('keyword') keyword: string,
    @Query('page') page: string = '1',
    @Query('count') count: string = '50',
    @Query('floorId') floorId: string,
    @Query('wingId') wingId: string,
  ) {
    return await this.kioskService.getKiosks({
      keyword,
      page,
      count,
      floorId,
      wingId,
    });
  }

  @Get(':id')
  async getKioskById(@Param('id') id: number): Promise<Kiosk> {
    return this.kioskService.getKioskById(+id);
  }

  @Get('/code/:code')
  async getKioskByCode(@Param('code') code: string): Promise<Kiosk> {
    return this.kioskService.getKioskByCode(code);
  }

  @Patch(':id')
  async updateKiosk(
    @Param('id') id: number,
    @Body() data: Prisma.KioskUpdateInput,
  ): Promise<Kiosk> {
    return this.kioskService.updateKiosk(+id, data);
  }

  @Delete(':id')
  async deleteKiosk(@Param('id') id: number) {
    return this.kioskService.deleteKiosk(+id);
  }
}
