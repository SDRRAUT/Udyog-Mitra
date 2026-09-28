import { Module } from '@nestjs/common';
import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class GrievancesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: string, data: any) {
    const ticketNo = `GRV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000+Math.random()*9000)}`;
    return this.prisma.grievance.create({
      data: { ...data, createdById: userId, ticketNo, status: 'OPEN', slaDueAt: new Date(Date.now() + 7*24*60*60*1000) },
    });
  }
  async findAll(userId: string, role: string) {
    const where = role === 'ENTREPRENEUR' ? { createdById: userId } : {};
    return this.prisma.grievance.findMany({ where, orderBy: { createdAt: 'desc' } });
  }
  async findOne(id: string) { return this.prisma.grievance.findUnique({ where: { id } }); }
  async update(id: string, data: any) { return this.prisma.grievance.update({ where: { id }, data }); }
}

@Controller('grievances')
@UseGuards(JwtAuthGuard)
export class GrievancesController {
  constructor(private readonly svc: GrievancesService) {}
  @Post() create(@Req() req: any, @Body() body: any) { return this.svc.create(req.user.id, body); }
  @Get() findAll(@Req() req: any) { return this.svc.findAll(req.user.id, req.user.role); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Post(':id/escalate') escalate(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, { status: 'ESCALATED', ...body }); }
}

@Module({ controllers: [GrievancesController], providers: [GrievancesService], exports: [GrievancesService] })
export class GrievancesModule {}
