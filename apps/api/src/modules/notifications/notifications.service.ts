import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
  ) {}

  async create(userId: string, data: {
    type: string;
    title: string;
    body?: string;
    link?: string;
    metadata?: any;
  }) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: data.type as any,
        title: data.title,
        body: data.body,
        link: data.link,
        metadata: data.metadata || {},
      },
    });

    // Real-time push
    this.gateway.emitNewNotification(userId, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      link: notification.link,
      createdAt: notification.createdAt,
    });

    return notification;
  }

  async createForDepartment(departmentId: string, data: any) {
    const officers = await this.prisma.user.findMany({
      where: { departmentId, isActive: true },
      select: { id: true },
    });

    const notifications = await Promise.all(
      officers.map(officer => this.create(officer.id, data))
    );

    return notifications;
  }

  async getForUser(userId: string, filters?: { isRead?: boolean; limit?: number; offset?: number }) {
    const [notifications, totalUnread] = await Promise.all([
      this.prisma.notification.findMany({
        where: {
          userId,
          ...(filters?.isRead !== undefined ? { isRead: filters.isRead } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 30,
        skip: filters?.offset || 0,
      }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, totalUnread };
  }

  async markRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
