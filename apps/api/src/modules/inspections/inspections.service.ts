import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InspectionsService {
  private readonly logger = new Logger(InspectionsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
    private readonly notifications: NotificationsService,
  ) {}

  async create(data: {
    applicationApprovalId: string;
    departmentId: string;
    scheduledAt?: string;
    venue?: string;
    officerIds?: string[];
  }) {
    const inspection = await this.prisma.inspection.create({
      data: {
        applicationApprovalId: data.applicationApprovalId,
        departmentId: data.departmentId,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        venue: data.venue,
        officerIds: data.officerIds || [],
        type: 'SINGLE',
        status: 'SCHEDULED',
      },
      include: { department: true, applicationApproval: { include: { application: { include: { user: { select: { id: true } } } } } } },
    });

    const entrepreneurId = inspection.applicationApproval.application.user.id;
    
    this.gateway.emitInspectionScheduled({
      appId: inspection.applicationApproval.applicationId,
      inspectionId: inspection.id,
      deptIds: [data.departmentId],
      scheduledAt: inspection.scheduledAt?.toISOString() || '',
      isJoint: false,
      entrepreneurId,
    });

    await this.notifications.create(entrepreneurId, {
      type: 'INSPECTION_SCHEDULED',
      title: `Inspection Scheduled by ${inspection.department.name}`,
      body: `Scheduled for ${inspection.scheduledAt?.toLocaleDateString()}`,
      link: `/entrepreneur/applications/${inspection.applicationApproval.applicationId}`,
    });

    return inspection;
  }

  async createJoint(data: {
    applicationId: string;
    departmentIds: string[];
    scheduledAt: string;
    venue?: string;
  }) {
    const application = await this.prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { user: { select: { id: true } }, approvals: true },
    });

    if (!application) throw new Error('Application not found');

    const jointInspection = await this.prisma.jointInspection.create({
      data: {
        applicationId: data.applicationId,
        scheduledAt: new Date(data.scheduledAt),
        venue: data.venue,
        status: 'SCHEDULED',
        attendeesJson: data.departmentIds,
      },
    });

    // Create linked inspections for each department
    const inspections: any[] = [];
    for (const deptId of data.departmentIds) {
      const deptApproval = application.approvals.find(a => a.departmentId === deptId);
      if (!deptApproval) continue;

      const insp = await this.prisma.inspection.create({
        data: {
          applicationApprovalId: deptApproval.id,
          departmentId: deptId,
          jointInspectionId: jointInspection.id,
          type: 'JOINT',
          status: 'SCHEDULED',
          scheduledAt: new Date(data.scheduledAt),
          venue: data.venue,
        },
      });
      inspections.push(insp);
    }

    const entrepreneurId = application.user.id;

    this.gateway.emitInspectionScheduled({
      appId: data.applicationId,
      inspectionId: jointInspection.id,
      deptIds: data.departmentIds,
      scheduledAt: data.scheduledAt,
      isJoint: true,
      entrepreneurId,
    });

    for (const deptId of data.departmentIds) {
      await this.notifications.createForDepartment(deptId, {
        type: 'INSPECTION_SCHEDULED',
        title: '🔍 Joint Inspection Scheduled',
        body: `Joint inspection scheduled for ${new Date(data.scheduledAt).toLocaleDateString()}`,
        link: `/department/inspections`,
        metadata: { jointInspectionId: jointInspection.id, applicationId: data.applicationId },
      });
    }

    await this.notifications.create(entrepreneurId, {
      type: 'INSPECTION_SCHEDULED',
      title: '🔍 Joint Inspection Scheduled',
      body: `Joint inspection with ${data.departmentIds.length} departments scheduled for ${new Date(data.scheduledAt).toLocaleDateString()}`,
      link: `/entrepreneur/applications/${data.applicationId}`,
    });

    return { jointInspection, inspections };
  }

  async complete(inspectionId: string, reportUrl?: string, notes?: string) {
    return this.prisma.inspection.update({
      where: { id: inspectionId },
      data: { status: 'COMPLETED', completedAt: new Date(), reportUrl, reportNotes: notes },
    });
  }

  async getAll(filters?: any) {
    return this.prisma.inspection.findMany({
      where: filters,
      include: { department: true, applicationApproval: { include: { application: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
