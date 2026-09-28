import { Module } from '@nestjs/common';
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Injectable()
export class QueriesService {
  constructor(private readonly prisma: PrismaService) {}
  async getForApproval(approvalId: string) {
    return this.prisma.query.findMany({ where: { applicationApprovalId: approvalId }, orderBy: { createdAt: 'asc' } });
  }
}
@Controller('queries')
@UseGuards(JwtAuthGuard)
export class QueriesController {
  constructor(private readonly svc: QueriesService) {}
  @Get('approval/:id') getForApproval(@Param('id') id: string) { return this.svc.getForApproval(id); }
}
@Module({ controllers: [QueriesController], providers: [QueriesService], exports: [QueriesService] })
export class QueriesModule {}
