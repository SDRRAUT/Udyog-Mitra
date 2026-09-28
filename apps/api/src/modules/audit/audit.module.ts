import { Module } from '@nestjs/common';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}
  async getLogs(filters?: any) {
    return this.prisma.auditLog.findMany({
      where: filters?.resource ? { resource: filters.resource } : {},
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(filters?.limit || '50'),
      skip: parseInt(filters?.offset || '0'),
    });
  }
  async create(data: any) {
    return this.prisma.auditLog.create({ data });
  }
}

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly svc: AuditService) {}
  @Get() getLogs(@Query() query: any) { return this.svc.getLogs(query); }
}

@Module({ controllers: [AuditController], providers: [AuditService], exports: [AuditService] })
export class AuditModule {}
