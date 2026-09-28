import { Module } from '@nestjs/common';
import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}
  async getForUser(userId: string) {
    return this.prisma.complianceItem.findMany({
      where: { application: { userId } },
      include: { application: { select: { businessName: true, applicationNo: true } } },
      orderBy: { dueDate: 'asc' },
    });
  }
  async triggerReminders() { return { message: 'Reminders triggered', count: 0 }; }
}

@Controller('compliance')
@UseGuards(JwtAuthGuard)
export class ComplianceController {
  constructor(private readonly svc: ComplianceService) {}
  @Get() getAll(@Req() req: any) { return this.svc.getForUser(req.user.id); }
  @Post('reminders/trigger') trigger() { return this.svc.triggerReminders(); }
}

@Module({ controllers: [ComplianceController], providers: [ComplianceService], exports: [ComplianceService] })
export class ComplianceModule {}
