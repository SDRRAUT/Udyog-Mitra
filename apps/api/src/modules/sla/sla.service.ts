// SLA Service - Cron-based SLA breach detection and auto-escalation
// Runs every 60 seconds to detect and handle SLA breaches

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';

const ESCALATION_ORDER = ['L1_OFFICER', 'L2_HOD', 'L3_DIC', 'L4_STATE_ADMIN'];

@Injectable()
export class SLAService {
  private readonly logger = new Logger(SLAService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
    private readonly notifications: NotificationsService,
  ) {}

  /**
   * SLA Breach Detection - Every 60 seconds
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async detectSLABreaches() {
    const now = new Date();

    try {
      // Find approvals that are past SLA but not yet marked as breached
      const overdueApprovals = await this.prisma.applicationApproval.findMany({
        where: {
          slaDueAt: { lt: now },
          slaBreached: false,
          status: {
            in: ['SUBMITTED', 'ASSIGNED', 'UNDER_SCRUTINY', 'QUERY_RAISED', 'INSPECTION_SCHEDULED'],
          },
        },
        include: {
          application: {
            include: {
              user: { select: { id: true, name: true } },
            },
          },
          department: true,
          assignedOfficer: { select: { id: true, name: true } },
          approvalMaster: { select: { name: true } },
        },
        take: 100, // Process in batches
      });

      for (const approval of overdueApprovals) {
        await this.handleSLABreach(approval, now);
      }

      // Check AT_RISK (< 24 hours remaining)
      const atRiskApprovals = await this.prisma.applicationApproval.findMany({
        where: {
          slaDueAt: {
            gt: now,
            lt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
          },
          slaStatus: 'ON_TRACK',
          slaBreached: false,
          status: {
            in: ['SUBMITTED', 'ASSIGNED', 'UNDER_SCRUTINY', 'QUERY_RAISED', 'INSPECTION_SCHEDULED'],
          },
        },
        include: {
          application: { include: { user: { select: { id: true } } } },
          department: true,
        },
        take: 100,
      });

      for (const approval of atRiskApprovals) {
        await this.markAtRisk(approval, now);
      }

      if (overdueApprovals.length > 0 || atRiskApprovals.length > 0) {
        this.logger.log(`SLA Check: ${overdueApprovals.length} breached, ${atRiskApprovals.length} at-risk`);
      }

    } catch (err) {
      this.logger.error('SLA cron error:', err.message);
    }
  }

  /**
   * Escalation check - Every 60 seconds
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkEscalations() {
    const now = new Date();

    try {
      const toEscalate = await this.prisma.applicationApproval.findMany({
        where: {
          slaBreached: true,
          escalationDueAt: { lt: now },
          escalationLevel: { not: 'L4_STATE_ADMIN' },
          status: {
            notIn: ['APPROVED', 'REJECTED', 'WITHDRAWN'],
          },
        },
        include: {
          application: { include: { user: { select: { id: true } } } },
          department: true,
          approvalMaster: { select: { name: true } },
        },
        take: 50,
      });

      for (const approval of toEscalate) {
        await this.escalate(approval, now);
      }
    } catch (err) {
      this.logger.error('Escalation cron error:', err.message);
    }
  }

  /**
   * Compliance reminder check - Every 30 minutes
   */
  @Cron('*/30 * * * *')
  async checkComplianceReminders() {
    const now = new Date();

    try {
      const reminders = await this.prisma.complianceItem.findMany({
        where: {
          status: { in: ['TRACKING', 'DUE'] },
          dueDate: { gt: now },
        },
        include: {
          application: { include: { user: { select: { id: true } } } },
        },
        take: 100,
      });

      for (const item of reminders) {
        const daysUntilDue = Math.ceil((item.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const reminderDays = Array.isArray(item.reminderDays) ? item.reminderDays as number[] : [30, 15, 7, 3, 1];
        
        if (reminderDays.includes(daysUntilDue)) {
          await this.notifications.create(item.application.user.id, {
            type: 'COMPLIANCE_DUE',
            title: `Compliance Due in ${daysUntilDue} day(s)`,
            body: `${item.name} is due on ${item.dueDate.toLocaleDateString()}`,
            link: `/entrepreneur/compliance`,
            metadata: { complianceId: item.id, daysUntilDue },
          });
        }
      }
    } catch (err) {
      this.logger.error('Compliance reminder error:', err.message);
    }
  }

  private async handleSLABreach(approval: any, now: Date) {
    const entrepreneurId = approval.application.user.id;

    // Mark as breached
    const nextEscalationDue = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24h for next escalation

    await this.prisma.applicationApproval.update({
      where: { id: approval.id },
      data: {
        slaBreached: true,
        slaBreachedAt: now,
        slaStatus: 'BREACHED',
        escalationLevel: 'L2_HOD', // Immediate L1->L2 on breach
        escalationDueAt: nextEscalationDue,
      },
    });

    // Create SLA breach log
    await this.prisma.sLABreachLog.create({
      data: {
        applicationApprovalId: approval.id,
        breachedAt: now,
        escalatedToLevel: 'L2_HOD',
        notifiedUserIds: [entrepreneurId],
      },
    });

    // Update application timeline
    await this.prisma.application.update({
      where: { id: approval.applicationId },
      data: {
        slaBreached: true,
        timeline: {
          push: {
            action: 'SLA_BREACH',
            approvalId: approval.id,
            deptId: approval.departmentId,
            by: 'SYSTEM',
            at: now.toISOString(),
            note: `SLA breached for ${approval.approvalMaster.name}. Escalated to HOD.`,
          },
        },
      },
    });

    // Emit real-time events
    this.gateway.emitSLABreached({
      appId: approval.applicationId,
      approvalId: approval.id,
      deptId: approval.departmentId,
      entrepreneurId,
      breachedAt: now.toISOString(),
      escalatedToLevel: 'L2_HOD',
    });

    // Notify entrepreneur
    await this.notifications.create(entrepreneurId, {
      type: 'SLA_BREACHED',
      title: '⚠️ SLA Breached - Escalation Initiated',
      body: `${approval.approvalMaster.name} processing has exceeded the ${approval.slaDays}-day SLA. Escalated to Department HOD.`,
      link: `/entrepreneur/applications/${approval.applicationId}`,
      metadata: { approvalId: approval.id, deptId: approval.departmentId },
    });

    this.logger.warn(`SLA BREACH: App ${approval.applicationId}, Approval ${approval.id}, Dept ${approval.department.code}`);
  }

  private async markAtRisk(approval: any, now: Date) {
    const hoursLeft = Math.ceil((approval.slaDueAt.getTime() - now.getTime()) / (1000 * 60 * 60));

    await this.prisma.applicationApproval.update({
      where: { id: approval.id },
      data: { slaStatus: 'AT_RISK' },
    });

    const entrepreneurId = approval.application.user.id;

    this.gateway.emitSLAAtRisk({
      appId: approval.applicationId,
      approvalId: approval.id,
      deptId: approval.departmentId,
      entrepreneurId,
      hoursLeft,
      slaDueAt: approval.slaDueAt.toISOString(),
    });

    // Notify entrepreneur
    await this.notifications.create(entrepreneurId, {
      type: 'SLA_AT_RISK',
      title: `⏰ SLA At Risk - ${hoursLeft} hours remaining`,
      body: `Your application approval is at risk of SLA breach.`,
      link: `/entrepreneur/applications/${approval.applicationId}`,
      metadata: { approvalId: approval.id, hoursLeft },
    });
  }

  private async escalate(approval: any, now: Date) {
    const currentIndex = ESCALATION_ORDER.indexOf(approval.escalationLevel);
    if (currentIndex === -1 || currentIndex >= ESCALATION_ORDER.length - 1) return;

    const nextLevel = ESCALATION_ORDER[currentIndex + 1];
    const nextEscalationDue = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +24h

    await this.prisma.applicationApproval.update({
      where: { id: approval.id },
      data: {
        escalationLevel: nextLevel as any,
        escalationDueAt: nextEscalationDue,
      },
    });

    // Log in application timeline
    await this.prisma.application.update({
      where: { id: approval.applicationId },
      data: {
        timeline: {
          push: {
            action: 'ESCALATE',
            approvalId: approval.id,
            fromLevel: approval.escalationLevel,
            toLevel: nextLevel,
            by: 'SYSTEM',
            at: now.toISOString(),
            note: `Escalated from ${approval.escalationLevel} to ${nextLevel}`,
          },
        },
      },
    });

    const entrepreneurId = approval.application.user.id;

    // Emit escalation event
    this.gateway.emitEscalation({
      appId: approval.applicationId,
      approvalId: approval.id,
      fromLevel: approval.escalationLevel,
      toLevel: nextLevel,
      deptId: approval.departmentId,
      entrepreneurId,
    });

    // Notify
    await this.notifications.create(entrepreneurId, {
      type: 'ESCALATED',
      title: `🚨 Application Escalated to ${this.getLevelName(nextLevel)}`,
      body: `Your application has been escalated due to non-processing within SLA.`,
      link: `/entrepreneur/applications/${approval.applicationId}`,
      metadata: { approvalId: approval.id, toLevel: nextLevel },
    });

    this.logger.warn(`ESCALATION: App ${approval.applicationId} → ${nextLevel}`);
  }

  private getLevelName(level: string): string {
    const names: Record<string, string> = {
      L1_OFFICER: 'Department Officer',
      L2_HOD: 'Department HOD',
      L3_DIC: 'District Industries Centre',
      L4_STATE_ADMIN: 'State Administration (MSIS)',
    };
    return names[level] || level;
  }
}
