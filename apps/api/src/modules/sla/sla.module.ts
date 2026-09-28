// SLA Module - Auto-escalation and breach detection (runs every 60 seconds)
import { Module } from '@nestjs/common';
import { SLAService } from './sla.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [WebsocketModule, NotificationsModule],
  providers: [SLAService],
  exports: [SLAService],
})
export class SLAModule {}
