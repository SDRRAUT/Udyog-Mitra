// WebSocket Gateway - Real-Time Events Hub
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  // userId -> Set of socketIds
  private userSockets = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  afterInit(server: Server) {
    this.logger.log('🔌 WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      client.join('public');

      if (!token || token === 'null' || token === 'undefined') {
        client.data.role = 'GUEST';
        this.logger.log(`Guest client connected: ${client.id}`);
        return;
      }

      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET || 'udyog-marg-secret',
        });

        client.data.userId = payload.sub;
        client.data.role = payload.role;
        client.data.departmentId = payload.departmentId;
        client.data.districtId = payload.districtId;

        // Auto-join rooms based on role
        client.join(`user:${payload.sub}`);
        
        if (payload.departmentId) {
          client.join(`dept:${payload.departmentId}`);
        }
        if (payload.districtId) {
          client.join(`district:${payload.districtId}`);
        }
        if (payload.role === 'STATE_ADMIN' || payload.role === 'SYSTEM') {
          client.join('state:admin');
        }
        if (payload.role === 'ENTREPRENEUR') {
          client.join(`entrepreneur:${payload.sub}`);
        }

        // Track socket
        if (!this.userSockets.has(payload.sub)) {
          this.userSockets.set(payload.sub, new Set());
        }
        this.userSockets.get(payload.sub)!.add(client.id);

        this.logger.log(`Client connected: ${client.id} (User: ${payload.sub}, Role: ${payload.role})`);
      } catch (jwtErr: any) {
        client.data.role = 'GUEST';
        this.logger.log(`Client connected with unverified token (guest mode): ${client.id}`);
      }
    } catch (err: any) {
      this.logger.warn(`Connection warning on ${client.id}: ${err.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(@ConnectedSocket() client: Socket, @MessageBody() token: string) {
    try {
      if (!token || token === 'null' || token === 'undefined') return;
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'udyog-marg-secret',
      });
      client.data.userId = payload.sub;
      client.data.role = payload.role;
      client.data.departmentId = payload.departmentId;
      client.data.districtId = payload.districtId;

      client.join(`user:${payload.sub}`);
      if (payload.departmentId) client.join(`dept:${payload.departmentId}`);
      if (payload.districtId) client.join(`district:${payload.districtId}`);
      if (payload.role === 'STATE_ADMIN' || payload.role === 'SYSTEM') client.join('state:admin');
      if (payload.role === 'ENTREPRENEUR') client.join(`entrepreneur:${payload.sub}`);

      if (!this.userSockets.has(payload.sub)) {
        this.userSockets.set(payload.sub, new Set());
      }
      this.userSockets.get(payload.sub)!.add(client.id);
      client.emit('authenticated', { userId: payload.sub, role: payload.role });
      this.logger.log(`Client re-authenticated: ${client.id} (User: ${payload.sub})`);
    } catch (err: any) {
      this.logger.warn(`Socket authentication error: ${err.message}`);
    }
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    // Allow joining application rooms
    if (room.startsWith('application:') || room.startsWith('user:') && room.includes(client.data.userId)) {
      client.join(room);
      this.logger.debug(`${client.id} joined room: ${room}`);
    }
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room);
  }

  @SubscribeMessage('mark_notification_read')
  handleMarkRead(@ConnectedSocket() client: Socket, @MessageBody() notificationId: string) {
    // Emit back to same user
    this.emitToUser(client.data.userId, 'notification_read', { notificationId });
  }

  // ===================== EMIT METHODS =====================

  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, { ...data, ts: new Date().toISOString() });
  }

  emitToUser(userId: string, event: string, data: any) {
    this.emitToRoom(`user:${userId}`, event, data);
  }

  emitToDept(departmentId: string, event: string, data: any) {
    this.emitToRoom(`dept:${departmentId}`, event, data);
  }

  emitToApplication(applicationId: string, event: string, data: any) {
    this.emitToRoom(`application:${applicationId}`, event, data);
  }

  emitToEntrepreneur(entrepreneurId: string, event: string, data: any) {
    this.emitToRoom(`entrepreneur:${entrepreneurId}`, event, data);
  }

  emitToStateAdmin(event: string, data: any) {
    this.emitToRoom('state:admin', event, data);
  }

  emitToDistrict(districtId: string, event: string, data: any) {
    this.emitToRoom(`district:${districtId}`, event, data);
  }

  // ===================== DOMAIN EVENTS =====================

  emitApplicationSubmitted(data: {
    appId: string;
    deptIds: string[];
    entrepreneurId: string;
    districtId: string;
    businessName: string;
    riskLevel: string;
  }) {
    // Emit to each department
    for (const deptId of data.deptIds) {
      this.emitToDept(deptId, 'application_submitted', data);
      this.emitToDept(deptId, 'dept_queue_update', { deptId, action: 'NEW_APPLICATION' });
    }
    this.emitToEntrepreneur(data.entrepreneurId, 'application_submitted', data);
    this.emitToDistrict(data.districtId, 'application_submitted', data);
    this.emitToStateAdmin('analytics_refresh', { scope: 'state', reason: 'application_submitted' });
  }

  emitStatusUpdated(data: {
    appId: string;
    approvalId: string;
    status: string;
    deptId: string;
    entrepreneurId: string;
    by: string;
    timeline: any;
  }) {
    this.emitToApplication(data.appId, 'application_status_updated', data);
    this.emitToEntrepreneur(data.entrepreneurId, 'application_status_updated', data);
    this.emitToDept(data.deptId, 'application_status_updated', data);
    this.emitToStateAdmin('analytics_refresh', { scope: 'state' });
  }

  emitQueryRaised(data: {
    appId: string;
    approvalId: string;
    queryId: string;
    queryText: string;
    by: string;
    entrepreneurId: string;
    deptId: string;
  }) {
    this.emitToEntrepreneur(data.entrepreneurId, 'query_raised', data);
    this.emitToUser(data.entrepreneurId, 'query_raised', data);
    this.emitToApplication(data.appId, 'query_raised', data);
  }

  emitQueryReplied(data: {
    appId: string;
    approvalId: string;
    queryId: string;
    by: string;
    deptId: string;
  }) {
    this.emitToDept(data.deptId, 'query_replied', data);
    this.emitToApplication(data.appId, 'query_replied', data);
  }

  emitInspectionScheduled(data: {
    appId: string;
    inspectionId: string;
    deptIds: string[];
    scheduledAt: string;
    isJoint: boolean;
    entrepreneurId: string;
  }) {
    for (const deptId of data.deptIds) {
      this.emitToDept(deptId, 'inspection_scheduled', data);
    }
    this.emitToEntrepreneur(data.entrepreneurId, 'inspection_scheduled', data);
    this.emitToApplication(data.appId, 'inspection_scheduled', data);
  }

  emitSLAAtRisk(data: {
    appId: string;
    approvalId: string;
    deptId: string;
    entrepreneurId: string;
    hoursLeft: number;
    slaDueAt: string;
  }) {
    this.emitToDept(data.deptId, 'sla_at_risk', data);
    this.emitToEntrepreneur(data.entrepreneurId, 'sla_at_risk', data);
    this.emitToStateAdmin('sla_at_risk', data);
  }

  emitSLABreached(data: {
    appId: string;
    approvalId: string;
    deptId: string;
    entrepreneurId: string;
    breachedAt: string;
    escalatedToLevel: string;
  }) {
    this.emitToDept(data.deptId, 'sla_breach', data);
    this.emitToEntrepreneur(data.entrepreneurId, 'sla_breach', data);
    this.emitToApplication(data.appId, 'sla_breach', data);
    this.emitToStateAdmin('sla_breach', data);
  }

  emitEscalation(data: {
    appId: string;
    approvalId: string;
    fromLevel: string;
    toLevel: string;
    deptId: string;
    entrepreneurId: string;
  }) {
    this.emitToDept(data.deptId, 'escalation_triggered', data);
    this.emitToEntrepreneur(data.entrepreneurId, 'escalation_triggered', data);
    this.emitToStateAdmin('escalation_triggered', data);
  }

  emitRiskUpdated(data: { appId: string; riskScore: number; riskLevel: string }) {
    this.emitToApplication(data.appId, 'risk_updated', data);
    this.emitToStateAdmin('risk_updated', data);
  }

  emitDelayRiskUpdated(data: { appId: string; delayRisk: number; reasons: string[] }) {
    this.emitToApplication(data.appId, 'delay_risk_updated', data);
  }

  emitReadinessScoreUpdated(data: { appId: string; readinessScore: number }) {
    this.emitToApplication(data.appId, 'readiness_score_updated', data);
  }

  emitNewNotification(userId: string, notification: any) {
    this.emitToUser(userId, 'notification_new', notification);
  }

  emitDeptQueueUpdate(deptId: string, data: any) {
    this.emitToDept(deptId, 'dept_queue_update', data);
  }

  emitAnalyticsRefresh(scope: 'state' | 'district' | 'dept', scopeId?: string) {
    this.emitToStateAdmin('analytics_refresh', { scope, scopeId, ts: new Date().toISOString() });
  }

  getConnectedCount(): number {
    return this.server.sockets.sockets.size;
  }
}
