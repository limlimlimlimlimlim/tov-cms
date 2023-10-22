// kiosk.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
  async getKiosks(): Promise<Kiosk[]> {
    return this.kioskService.getKiosks();
  }

  @Get(':id')
  async getKioskById(@Param('id') id: number): Promise<Kiosk> {
    return this.kioskService.getKioskById(+id);
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
