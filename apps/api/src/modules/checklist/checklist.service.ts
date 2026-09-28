import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RuleEngineService, ProjectData, ChecklistGenerationResult } from './rule-engine.service';

@Injectable()
export class ChecklistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ruleEngine: RuleEngineService,
  ) {}

  async generateChecklist(projectData: ProjectData): Promise<ChecklistGenerationResult> {
    return this.ruleEngine.generateChecklist(projectData);
  }

  async getRules(filters?: { isActive?: boolean }) {
    return this.prisma.checklistRule.findMany({
      where: filters?.isActive !== undefined ? { isActive: filters.isActive } : {},
      orderBy: { priority: 'asc' },
    });
  }

  async saveChecklistForApplication(applicationId: string, items: any[]) {
    // Delete existing checklist items
    await this.prisma.checklistItem.deleteMany({ where: { applicationId } });

    // Create new ones
    return this.prisma.checklistItem.createMany({
      data: items.map(item => ({
        applicationId,
        approvalMasterId: item.approvalMasterId,
        applicability: item.applicability,
        explanation: item.explanation,
        sourceRef: item.sourceRef,
        priority: item.priority,
        dependencies: item.dependencies,
      })),
    });
  }
}
