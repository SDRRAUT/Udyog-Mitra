// Approvals Service - Department officer workflow management
import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ApprovalsService {
  private readonly logger = new Logger(ApprovalsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
    private readonly notifications: NotificationsService,
  ) {}

  async getDeptQueue(departmentId?: string, filters?: any) {
    const where: any = {
      status: { notIn: ['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN'] },
      ...(filters?.slaStatus ? { slaStatus: filters.slaStatus } : {}),
    };
    if (departmentId) {
      where.departmentId = departmentId;
    }
    return this.prisma.applicationApproval.findMany({
      where,
      include: {
        application: {
          include: {
            user: { select: { name: true, email: true, mobile: true } },
            district: { select: { name: true } },
          },
        },
        approvalMaster: { select: { name: true, code: true, slaDays: true } },
        assignedOfficer: { select: { name: true, email: true } },
      },
      orderBy: [
        { slaStatus: 'desc' },
        { slaDueAt: 'asc' },
        { createdAt: 'asc' },
      ],
      take: filters?.limit ? parseInt(filters.limit, 10) : 50,
    });
  }

  async updateStatus(approvalId: string, userId: string, departmentId: string, action: string, remarks?: string) {
    const approval = await this.prisma.applicationApproval.findUnique({
      where: { id: approvalId },
      include: {
        application: { include: { user: { select: { id: true, name: true } } } },
        approvalMaster: true,
        department: true,
      },
    });

    if (!approval) throw new NotFoundException('Approval not found');
    if (approval.departmentId !== departmentId) throw new ForbiddenException('Not your department');

    const statusMap: Record<string, string> = {
      assign: 'ASSIGNED',
      start_scrutiny: 'UNDER_SCRUTINY',
      recommend: 'RECOMMENDED',
      approve: 'APPROVED',
      reject: 'REJECTED',
      return: 'RETURNED',
    };

    const newStatus = statusMap[action.toLowerCase()] || action.toUpperCase();
    const now = new Date();

    const workflowEntry = {
      action: action.toUpperCase(),
      by: userId,
      at: now.toISOString(),
      fromStatus: approval.status,
      toStatus: newStatus,
      remarks,
    };

    const updates: any = {
      status: newStatus,
      workflowHistory: { push: workflowEntry },
    };

    if (newStatus === 'ASSIGNED') updates.assignedOfficerId = userId;
    if (newStatus === 'UNDER_SCRUTINY') updates.startedAt = now;
    if (['APPROVED', 'REJECTED'].includes(newStatus)) updates.completedAt = now;
    if (remarks) updates.officerRemarks = remarks;
    if (newStatus === 'REJECTED') updates.rejectionReason = remarks;

    await this.prisma.applicationApproval.update({
      where: { id: approvalId },
      data: updates,
    });

    // Update application timeline
    await this.prisma.application.update({
      where: { id: approval.applicationId },
      data: {
        timeline: {
          push: {
            action: `APPROVAL_${newStatus}`,
            approvalId: approval.id,
            approvalName: approval.approvalMaster.name,
            by: userId,
            at: now.toISOString(),
            note: remarks,
          },
        },
      },
    });

    // Check if all approvals done
    if (['APPROVED', 'REJECTED'].includes(newStatus)) {
      await this.checkAllApprovalsComplete(approval.applicationId);
    }

    const entrepreneurId = approval.application.user.id;

    // Emit real-time
    this.gateway.emitStatusUpdated({
      appId: approval.applicationId,
      approvalId: approval.id,
      status: newStatus,
      deptId: approval.departmentId,
      entrepreneurId,
      by: userId,
      timeline: workflowEntry,
    });

    this.gateway.emitDeptQueueUpdate(approval.departmentId, {
      deptId: approval.departmentId,
      action: 'STATUS_CHANGED',
      approvalId,
      newStatus,
    });

    this.gateway.emitAnalyticsRefresh('dept', approval.departmentId);

    // Notify entrepreneur
    const notifTypeMap: Record<string, string> = {
      APPROVED: 'APPROVED',
      REJECTED: 'REJECTED',
      RETURNED: 'RETURNED',
      UNDER_SCRUTINY: 'APPLICATION_STATUS_UPDATED',
    };

    await this.notifications.create(entrepreneurId, {
      type: notifTypeMap[newStatus] || 'APPLICATION_STATUS_UPDATED',
      title: `${approval.approvalMaster.name}: ${newStatus}`,
      body: remarks || `Status updated to ${newStatus} by ${approval.department.name}`,
      link: `/entrepreneur/applications/${approval.applicationId}`,
      metadata: { approvalId, newStatus, deptId: approval.departmentId },
    });

    this.logger.log(`Approval ${approvalId}: ${approval.status} → ${newStatus} by ${userId}`);
    return { success: true, status: newStatus };
  }

  private async checkAllApprovalsComplete(applicationId: string) {
    const allApprovals = await this.prisma.applicationApproval.findMany({
      where: { applicationId },
    });

    const allDone = allApprovals.every(a => ['APPROVED', 'REJECTED', 'WITHDRAWN'].includes(a.status));
    const allApproved = allApprovals.every(a => a.status === 'APPROVED');

    if (allDone) {
      await this.prisma.application.update({
        where: { id: applicationId },
        data: {
          overallStatus: allApproved ? 'APPROVED' : 'UNDER_PROCESS',
          completedAt: allApproved ? new Date() : null,
        },
      });
    }
  }

  async raiseQuery(approvalId: string, userId: string, queryText: string, attachmentUrls?: string[]) {
    const approval = await this.prisma.applicationApproval.findUnique({
      where: { id: approvalId },
      include: {
        application: { include: { user: { select: { id: true } } } },
        approvalMaster: true,
        department: true,
      },
    });
    if (!approval) throw new NotFoundException('Approval not found');

    const query = await this.prisma.query.create({
      data: {
        applicationApprovalId: approvalId,
        raisedById: userId,
        queryText,
        status: 'OPEN',
        attachmentUrls: attachmentUrls || [],
      },
    });

    // Update approval status and query count
    await this.prisma.applicationApproval.update({
      where: { id: approvalId },
      data: {
        status: 'QUERY_RAISED',
        queryCount: { increment: 1 },
        workflowHistory: {
          push: {
            action: 'RAISE_QUERY',
            by: userId,
            at: new Date().toISOString(),
            queryId: query.id,
          },
        },
      },
    });

    const entrepreneurId = approval.application.user.id;

    // Emit real-time
    this.gateway.emitQueryRaised({
      appId: approval.applicationId,
      approvalId,
      queryId: query.id,
      queryText: queryText.slice(0, 100),
      by: userId,
      entrepreneurId,
      deptId: approval.departmentId,
    });

    // Notify entrepreneur
    await this.notifications.create(entrepreneurId, {
      type: 'QUERY_RAISED',
      title: `Query raised on ${approval.approvalMaster.name}`,
      body: queryText.slice(0, 150),
      link: `/entrepreneur/applications/${approval.applicationId}`,
      metadata: { approvalId, queryId: query.id },
    });

    return query;
  }

  async replyQuery(queryId: string, userId: string, replyText: string, replyAttachmentUrls?: string[]) {
    const query = await this.prisma.query.findUnique({
      where: { id: queryId },
      include: {
        applicationApproval: {
          include: {
            application: true,
            department: true,
          },
        },
      },
    });
    if (!query) throw new NotFoundException('Query not found');

    const updated = await this.prisma.query.update({
      where: { id: queryId },
      data: {
        repliedById: userId,
        replyText,
        status: 'RESPONDED',
        repliedAt: new Date(),
        replyAttachmentUrls: replyAttachmentUrls || [],
      },
    });

    // Update approval status back
    await this.prisma.applicationApproval.update({
      where: { id: query.applicationApprovalId },
      data: { status: 'UNDER_SCRUTINY' },
    });

    // Emit real-time
    this.gateway.emitQueryReplied({
      appId: query.applicationApproval.applicationId,
      approvalId: query.applicationApprovalId,
      queryId,
      by: userId,
      deptId: query.applicationApproval.departmentId,
    });

    // Notify dept officer
    await this.notifications.createForDepartment(query.applicationApproval.departmentId, {
      type: 'QUERY_REPLIED',
      title: 'Query Replied',
      body: replyText.slice(0, 150),
      link: `/department/applications/${query.applicationApproval.applicationId}`,
      metadata: { queryId, approvalId: query.applicationApprovalId },
    });

    return updated;
  }

  async getQueriesForApproval(approvalId: string) {
    return this.prisma.query.findMany({
      where: { applicationApprovalId: approvalId },
      include: {
        raisedBy: { select: { name: true, role: true } },
        repliedBy: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
