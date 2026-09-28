import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as jsonLogic from 'json-logic-js';

@Injectable()
export class SchemesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.schemeMaster.findMany({ where: { isActive: true } });
  }

  async getEligibility(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: { include: { entrepreneurProfile: true } } },
    });
    if (!app) throw new Error('Application not found');

    const schemes = await this.prisma.schemeMaster.findMany({ where: { isActive: true } });

    const projectData = app.projectDetailsJson as any || {};
    const profile = app.user.entrepreneurProfile;

    const evalData = {
      entityType: app.entityType,
      businessStage: app.businessStage,
      sector: app.sector,
      locationType: app.locationType,
      totalInvestmentLakhs: projectData.totalInvestmentLakhs || 0,
      employeeCount: projectData.estimatedEmployees || 0,
      powerKW: projectData.powerKW || 0,
      isWomenEntrepreneur: profile?.isWomenEntrepreneur || false,
      isSCST: profile?.isSCST || false,
      isMSME: profile?.isMSME || false,
    };

    const results: any[] = [];
    for (const scheme of schemes) {
      let isEligible = false;
      let matchPercent = 0;
      const reasons: string[] = [];

      try {
        const rules = scheme.eligibilityRules as any;
        isEligible = jsonLogic.apply(rules, evalData) === true;
        matchPercent = isEligible ? 85 : 20;
        if (isEligible) reasons.push('Meets all eligibility criteria');
        else reasons.push('Does not meet all criteria');
      } catch {
        isEligible = false;
        reasons.push('Rule evaluation error');
      }

      // Upsert eligibility
      const elig = await this.prisma.schemeEligibility.upsert({
        where: { applicationId_schemeId: { applicationId, schemeId: scheme.id } },
        update: { isEligible, matchPercent, reasons, evaluatedAt: new Date() },
        create: { applicationId, schemeId: scheme.id, isEligible, matchPercent, reasons },
      });

      results.push({ scheme, eligibility: elig });
    }

    return results;
  }
}
