// Applications Service - Core business logic for application lifecycle
import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppGateway } from '../websocket/app.gateway';
import { RuleEngineService } from '../checklist/rule-engine.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: AppGateway,
    private readonly ruleEngine: RuleEngineService,
    private readonly notifications: NotificationsService,
  ) {}

  async createDraft(userId: string, districtId: string, data: any) {
    const draft = await this.prisma.application.create({
      data: {
        userId,
        districtId,
        businessName: data.businessName,
        entityType: data.entityType,
        businessStage: data.businessStage,
        sector: data.sector,
        subSector: data.subSector,
        locationType: data.locationType,
        talukaName: data.talukaName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        pincode: data.pincode,
        projectDetailsJson: data.projectDetailsJson || {},
        overallStatus: 'DRAFT',
      },
      include: { district: true },
    });

    // Calculate initial readiness score
    const readinessScore = this.calculateReadinessScore(draft, data.projectDetailsJson || {});
    
    await this.prisma.application.update({
      where: { id: draft.id },
      data: { readinessScore },
    });

    return { ...draft, readinessScore };
  }

  async updateDraft(applicationId: string, userId: string, data: any) {
    const app = await this.prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) throw new NotFoundException('Application not found');
    if (app.userId !== userId) throw new ForbiddenException('Not your application');
    if (app.overallStatus !== 'DRAFT') throw new BadRequestException('Can only edit draft applications');

    const updated = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        businessName: data.businessName ?? app.businessName,
        entityType: data.entityType ?? app.entityType,
        businessStage: data.businessStage ?? app.businessStage,
        sector: data.sector ?? app.sector,
        subSector: data.subSector ?? app.subSector,
        locationType: data.locationType ?? app.locationType,
        talukaName: data.talukaName ?? app.talukaName,
        addressLine1: data.addressLine1 ?? app.addressLine1,
        addressLine2: data.addressLine2 ?? app.addressLine2,
        pincode: data.pincode ?? app.pincode,
        projectDetailsJson: data.projectDetailsJson ?? app.projectDetailsJson,
      },
      include: { district: true },
    });

    // Recalculate readiness score
    const readinessScore = this.calculateReadinessScore(updated, updated.projectDetailsJson as any || {});
    
    await this.prisma.application.update({
      where: { id: applicationId },
      data: { readinessScore },
    });

    // Emit readiness update
    this.gateway.emitReadinessScoreUpdated({ appId: applicationId, readinessScore });

    return { ...updated, readinessScore };
  }

  async submitApplication(applicationId: string, userId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        checklistItems: { include: { approvalMaster: { include: { department: true } } } },
        district: true,
      },
    });

    if (!app) throw new NotFoundException('Application not found');
    if (app.userId !== userId) throw new ForbiddenException('Not your application');
    if (app.overallStatus !== 'DRAFT') throw new BadRequestException('Application already submitted');

    // Compute risk score on submission
    const projectData = app.projectDetailsJson as any || {};
    const { riskScore, riskLevel } = this.ruleEngine.computeRiskScore({
      pollutionCategory: projectData.pollutionCategory,
      hasHazardousSubstances: projectData.hasHazardousSubstances,
      ecologicallySensitive: projectData.ecologicallySensitive,
      buildingHeight: projectData.buildingHeight,
      powerKW: projectData.powerKW,
      waterRequirementKLD: projectData.waterRequirementKLD,
      employeeCount: projectData.estimatedEmployees,
      totalInvestmentLakhs: projectData.totalInvestmentLakhs,
    });

    const fastTrackEligible = riskLevel === 'LOW' && !projectData.hasHazardousSubstances;
    const requiresDetailedScrutiny = riskLevel === 'HIGH';

    const submittedAt = new Date();
    const timelineEntry = {
      action: 'APPLICATION_SUBMITTED',
      by: userId,
      at: submittedAt.toISOString(),
      note: 'Application submitted for processing',
    };

    // Update application
    const updatedApp = await this.prisma.application.update({
      where: { id: applicationId },
      data: {
        overallStatus: 'SUBMITTED',
        currentStage: 'UNDER_PROCESS',
        riskScore,
        riskLevel: riskLevel as any,
        fastTrackEligible,
        requiresDetailedScrutiny,
        submittedAt,
        timeline: {
          push: timelineEntry,
        },
      },
      include: {
        checklistItems: { include: { approvalMaster: { include: { department: true } } } },
      },
    });

    // Create ApplicationApprovals for each checklist item that's MANDATORY or CONDITIONAL
    const deptIds: string[] = [];
    for (const item of app.checklistItems) {
      if (item.applicability === 'NOT_APPLICABLE') continue;

      const slaDueAt = new Date(submittedAt.getTime() + item.approvalMaster.slaDays * 24 * 60 * 60 * 1000);
      
      const existing = await this.prisma.applicationApproval.findFirst({
        where: { applicationId, approvalMasterId: item.approvalMasterId },
      });

      if (!existing) {
        await this.prisma.applicationApproval.create({
          data: {
            applicationId,
            approvalMasterId: item.approvalMasterId,
            departmentId: item.approvalMaster.departmentId,
            status: 'SUBMITTED',
            slaDays: item.approvalMaster.slaDays,
            slaDueAt,
            slaStatus: 'ON_TRACK',
            startedAt: submittedAt,
            workflowHistory: [{
              action: 'SUBMIT',
              by: userId,
              at: submittedAt.toISOString(),
              fromStatus: 'DRAFT',
              toStatus: 'SUBMITTED',
            }],
          },
        });

        if (!deptIds.includes(item.approvalMaster.departmentId)) {
          deptIds.push(item.approvalMaster.departmentId);
        }
      }
    }

    // Emit real-time events
    this.gateway.emitApplicationSubmitted({
      appId: applicationId,
      deptIds,
      entrepreneurId: userId,
      districtId: app.districtId,
      businessName: app.businessName || '',
      riskLevel,
    });

    this.gateway.emitRiskUpdated({ appId: applicationId, riskScore, riskLevel });

    // Create notifications for departments
    for (const deptId of deptIds) {
      await this.notifications.createForDepartment(deptId, {
        type: 'APPLICATION_SUBMITTED',
        title: 'New Application Received',
        body: `New application from ${app.businessName || 'Entrepreneur'} (Risk: ${riskLevel})`,
        link: `/department/applications/${applicationId}`,
        metadata: { appId: applicationId, riskLevel },
      });
    }

    this.logger.log(`Application ${applicationId} submitted. Risk: ${riskScore} (${riskLevel}). Depts: ${deptIds.length}`);

    return updatedApp;
  }

  async getApplications(userId: string, role: string, departmentId?: string, filters?: any) {
    const where: any = {};

    if (role === 'ENTREPRENEUR') {
      where.userId = userId;
      where.isDeleted = false;
    } else if (role === 'DEPARTMENT_OFFICER' || role === 'HOD') {
      // Department officers see applications that have their dept's approvals
      where.approvals = { some: { departmentId } };
    } else if (role === 'DIC_OFFICER') {
      where.approvals = { some: {} };
    } else if (role === 'STATE_ADMIN') {
      // All applications
    }

    if (filters?.status) where.overallStatus = filters.status;
    if (filters?.riskLevel) where.riskLevel = filters.riskLevel;

    return this.prisma.application.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, mobile: true } },
        district: { select: { name: true, code: true } },
        approvals: {
          include: {
            department: { select: { name: true, code: true, color: true } },
            approvalMaster: { select: { name: true, code: true } },
          },
        },
        _count: { select: { documents: true } },
      },
      orderBy: [
        { riskScore: 'desc' },
        { submittedAt: 'asc' },
        { createdAt: 'desc' },
      ],
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });
  }

  async getApplicationById(applicationId: string, userId: string, role: string, departmentId?: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: { select: { name: true, email: true, mobile: true } },
        district: { select: { name: true, code: true } },
        approvals: {
          include: {
            department: true,
            approvalMaster: { include: { department: true } },
            assignedOfficer: { select: { name: true, email: true } },
            queries: {
              include: {
                raisedBy: { select: { name: true, role: true } },
                repliedBy: { select: { name: true, role: true } },
              },
              orderBy: { createdAt: 'desc' },
            },
            inspections: {
              include: { department: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        documents: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
        },
        checklistItems: {
          include: { approvalMaster: { include: { department: true } } },
        },
        schemeEligibilities: {
          include: { scheme: true },
        },
        complianceItems: true,
        grievances: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!app) throw new NotFoundException('Application not found');

    // Access control
    if (role === 'ENTREPRENEUR' && app.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    if (role === 'DEPARTMENT_OFFICER' || role === 'HOD') {
      const hasAccess = app.approvals.some(a => a.departmentId === departmentId);
      if (!hasAccess) throw new ForbiddenException('Access denied');
    }

    return app;
  }

  async getCAFData(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          include: { entrepreneurProfile: true },
        },
      },
    });
    if (!app) throw new NotFoundException('Application not found');
    return {
      promoter: app.user.entrepreneurProfile,
      entity: {
        entityType: app.entityType,
        businessName: app.businessName,
      },
      project: app.projectDetailsJson,
      location: {
        locationType: app.locationType,
        talukaName: app.talukaName,
        addressLine1: app.addressLine1,
        addressLine2: app.addressLine2,
        pincode: app.pincode,
        districtId: app.districtId,
      },
    };
  }

  private calculateReadinessScore(app: any, projectDetails: any): number {
    let score = 0;
    let profileScore = 0;
    let projectScore = 0;

    // Profile (25%)
    const profile = [app.businessName, app.entityType];
    const profileFilled = profile.filter(Boolean).length;
    profileScore = (profileFilled / profile.length) * 25;

    // Project (40%)
    const project = [
      projectDetails.pollutionCategory,
      projectDetails.totalInvestmentLakhs,
      projectDetails.estimatedEmployees,
      projectDetails.powerKW,
      app.locationType,
      app.sector,
      app.businessStage,
    ];
    const projectFilled = project.filter(v => v !== undefined && v !== null && v !== '').length;
    projectScore = (projectFilled / project.length) * 40;

    // Documents (35%) - base score without docs
    const docScore = 15; // base for having started

    score = Math.round(profileScore + projectScore + docScore);
    return Math.min(100, score);
  }

  async addTimelineEntry(applicationId: string, entry: any) {
    return this.prisma.application.update({
      where: { id: applicationId },
      data: {
        timeline: { push: entry },
      },
    });
  }
}
