// permission.controller.ts

import { Controller, Get, Post } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  async getAllKiosks() {
    return this.monitoringService.getAllKiosks();
  }

  @Post('/reset')
  async resetMonotiring() {
    return this.monitoringService.reset();
  }
}
