import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MonitoringService } from './monitoring/monitoring.service';

@WebSocketGateway({ cors: true, maxHttpBufferSize: 100000000 })
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly monitoringService: MonitoringService) {} // UserService 주입

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sync')
  handleSyncMessage(@MessageBody() message: string): void {
    console.log('sync : ', message);
    this.server.emit('sync', message);
  }

  @SubscribeMessage('monitoring')
  handleMonitoringMessage(): void {
    console.log('event : ', 'monitoring');
    this.server.emit('monitoring');
  }

  @SubscribeMessage('screenshot')
  async handleScreenshotMessage(
    @MessageBody() message: { code: string; data: string },
  ) {
    console.log('evnet : screenshot, message : ', message.code);
    await this.monitoringService.updateKiosk(message.code, message.data);
    this.server.emit('monitoring-response');
  }
}
