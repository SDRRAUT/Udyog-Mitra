import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';
import { WebsocketModule } from '../websocket/websocket.module';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
  ) {}

  async getHealth() {
    let dbOk = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {}

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      name: 'UDYOG MARG API',
      services: {
        database: dbOk ? 'connected' : 'error',
        websocket: 'connected',
      },
      uptime: process.uptime(),
    };
  }

  async getRealtimeHealth() {
    return {
      websocket: {
        status: 'connected',
        connectedClients: this.gateway.getConnectedCount(),
      },
    };
  }
}

@Controller('health')
export class HealthController {
  constructor(private readonly svc: HealthService) {}
  @Get() getHealth() { return this.svc.getHealth(); }
  @Get('realtime') getRealtime() { return this.svc.getRealtimeHealth(); }
}

@Module({
  imports: [WebsocketModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
