import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WSGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

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
  handleMonitoringMessage(@MessageBody() message: string): void {
    console.log('monitoring : ', message);
    this.server.emit('monitoring', message);
  }
}
