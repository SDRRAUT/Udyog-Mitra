// Deterministic Rule Engine - JSONLogic Evaluator
// CRITICAL: Compliance logic NEVER guesses - always deterministic

import { Injectable, Logger } from '@nestjs/common';
import * as jsonLogic from 'json-logic-js';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProjectData {
  // Entity
  entityType?: string;
  businessStage?: string;
  sector?: string;
  subSector?: string;
  // Location
  locationType?: string;
  districtCode?: string;
  // Technical
  pollutionCategory?: string;
  hasHazardousSubstances?: boolean;
  ecologicallySensitive?: boolean;
  buildingHeight?: number;
  powerKW?: number;
  waterRequirementKLD?: number;
  employeeCount?: number;
  hasBoiler?: boolean;
  landType?: string;
  // Financial
  totalInvestmentLakhs?: number;
  plantMachineryInvestmentLakhs?: number;
  // Owner
  isWomenEntrepreneur?: boolean;
  isSCST?: boolean;
  isMSME?: boolean;
}

export interface ChecklistGenerationResult {
  items: ChecklistItem[];
  summary: {
    mandatory: number;
    conditional: number;
    total: number;
    fastTrackEligible: boolean;
    riskScore: number;
    riskLevel: string;
    generatedAt: string;
  };
  groupedByDept: Record<string, ChecklistItem[]>;
}

export interface ChecklistItem {
  approvalCode: string;
  approvalName: string;
  approvalShortName: string;
  departmentName: string;
  departmentCode: string;
  applicability: 'MANDATORY' | 'CONDITIONAL' | 'NOT_APPLICABLE';
  explanation: string;
  sourceRef: string;
  priority: number;
  dependencies: string[];
  slaDays: number;
  requiredDocs: any[];
  isParallelEligible: boolean;
  ruleId: string;
  approvalMasterId: string;
  departmentId: string;
}

@Injectable()
export class RuleEngineService {
  private readonly logger = new Logger(RuleEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * CORE: Generate checklist using deterministic rule engine
   * NEVER uses LLM for applicability - always rule-based
   */
  async generateChecklist(projectData: ProjectData): Promise<ChecklistGenerationResult> {
    const startTime = Date.now();

    // Load all active rules from DB
    const rules = await this.prisma.checklistRule.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });

    // Load all active approval masters with department info
    const approvalMasters = await this.prisma.approvalMaster.findMany({
      where: { isActive: true },
      include: { department: true },
    });

    const masterMap = new Map(approvalMasters.map(am => [am.code, am]));

    // Track which approvals are applicable and their best applicability
    const applicabilityMap = new Map<string, {
      applicability: 'MANDATORY' | 'CONDITIONAL' | 'NOT_APPLICABLE';
      explanation: string;
      sourceRef: string;
      priority: number;
      ruleId: string;
    }>();

    // Evaluate each rule
    for (const rule of rules) {
      try {
        const conditions = rule.conditions as any;
        const result = this.evaluateConditions(conditions, projectData);
        
        if (result) {
          const approvalCodes = Array.isArray(rule.applicableApprovals) ? (rule.applicableApprovals as string[]) : [];
          
          for (const code of approvalCodes) {
            const existing = applicabilityMap.get(code);
            
            // MANDATORY overrides CONDITIONAL overrides NOT_APPLICABLE
            const newApplicability = rule.mandatory ? 'MANDATORY' : 'CONDITIONAL';
            
            if (!existing || 
                (existing.applicability === 'CONDITIONAL' && newApplicability === 'MANDATORY') ||
                (existing.priority > rule.priority)) {
              applicabilityMap.set(code, {
                applicability: newApplicability,
                explanation: rule.explanation || 'Required based on your project parameters',
                sourceRef: rule.sourceRef || '',
                priority: rule.priority,
                ruleId: rule.ruleId,
              });
            }
          }
        }
      } catch (err) {
        this.logger.warn(`Rule evaluation error for ${rule.ruleId}: ${err.message}`);
      }
    }

    // Build checklist items
    const items: ChecklistItem[] = [];

    for (const [code, applicabilityInfo] of applicabilityMap.entries()) {
      if (applicabilityInfo.applicability === 'NOT_APPLICABLE') continue;
      
      const master = masterMap.get(code);
      if (!master) continue;

      items.push({
        approvalCode: master.code,
        approvalName: master.name,
        approvalShortName: master.shortName || master.name,
        departmentName: master.department.name,
        departmentCode: master.department.code,
        applicability: applicabilityInfo.applicability,
        explanation: applicabilityInfo.explanation,
        sourceRef: applicabilityInfo.sourceRef,
        priority: applicabilityInfo.priority,
        dependencies: Array.isArray(master.dependencies) ? master.dependencies as string[] : [],
        slaDays: master.slaDays,
        requiredDocs: Array.isArray(master.requiredDocs) ? master.requiredDocs : [],
        isParallelEligible: master.isParallelEligible,
        ruleId: applicabilityInfo.ruleId,
        approvalMasterId: master.id,
        departmentId: master.departmentId,
      });
    }

    // Sort by priority, then mandatory first
    items.sort((a, b) => {
      if (a.applicability === 'MANDATORY' && b.applicability !== 'MANDATORY') return -1;
      if (b.applicability === 'MANDATORY' && a.applicability !== 'MANDATORY') return 1;
      return a.priority - b.priority;
    });

    // Compute risk score
    const { riskScore, riskLevel } = this.computeRiskScore(projectData);

    // Group by department
    const groupedByDept: Record<string, ChecklistItem[]> = {};
    for (const item of items) {
      if (!groupedByDept[item.departmentCode]) {
        groupedByDept[item.departmentCode] = [];
      }
      groupedByDept[item.departmentCode].push(item);
    }

    const mandatory = items.filter(i => i.applicability === 'MANDATORY').length;
    const conditional = items.filter(i => i.applicability === 'CONDITIONAL').length;

    // Fast track eligibility
    const fastTrackEligible = 
      riskLevel === 'LOW' && 
      !projectData.hasHazardousSubstances && 
      !projectData.ecologicallySensitive &&
      (projectData.employeeCount || 0) <= 200;

    const elapsed = Date.now() - startTime;
    this.logger.log(`Checklist generated in ${elapsed}ms: ${items.length} approvals (${mandatory} mandatory, ${conditional} conditional)`);

    return {
      items,
      summary: {
        mandatory,
        conditional,
        total: items.length,
        fastTrackEligible,
        riskScore,
        riskLevel,
        generatedAt: new Date().toISOString(),
      },
      groupedByDept,
    };
  }

  /**
   * Evaluate JSONLogic conditions against project data
   * Supports: $and, $or, $not, $in, $nin, ==, ===, >, >=, <, <=, between
   */
  private evaluateConditions(conditions: any, data: ProjectData): boolean {
    if (!conditions || typeof conditions !== 'object') return false;

    // Handle custom operators that jsonlogic-js supports
    // Map $and/$or/$not/$in to jsonlogic equivalents
    const normalized = this.normalizeConditions(conditions);
    
    try {
      return jsonLogic.apply(normalized, data) === true;
    } catch (err) {
      // Fallback to manual evaluation
      return this.manualEvaluate(conditions, data);
    }
  }

  private normalizeConditions(cond: any): any {
    if (typeof cond !== 'object' || cond === null) return cond;
    
    if ('$and' in cond) return { and: (cond.$and as any[]).map(c => this.normalizeConditions(c)) };
    if ('$or' in cond) return { or: (cond.$or as any[]).map(c => this.normalizeConditions(c)) };
    if ('$not' in cond) return { '!': this.normalizeConditions(cond.$not) };
    if ('$in' in cond) {
      // { $in: [{ var: 'field' }, ['val1', 'val2']] }
      return { in: cond.$in.map((c: any) => this.normalizeConditions(c)) };
    }
    if ('$nin' in cond) {
      return { '!': { in: cond.$nin.map((c: any) => this.normalizeConditions(c)) } };
    }
    
    // Recursively handle nested
    const result: any = {};
    for (const [key, val] of Object.entries(cond)) {
      result[key] = this.normalizeConditions(val);
    }
    return result;
  }

  /** Manual fallback evaluator for edge cases */
  private manualEvaluate(cond: any, data: any): boolean {
    if (!cond || typeof cond !== 'object') return false;

    if ('$and' in cond) return (cond.$and as any[]).every(c => this.manualEvaluate(c, data));
    if ('$or' in cond) return (cond.$or as any[]).some(c => this.manualEvaluate(c, data));
    if ('$not' in cond) return !this.manualEvaluate(cond.$not, data);
    if ('$in' in cond) {
      const [varRef, values] = cond.$in;
      const fieldVal = this.resolveVar(varRef, data);
      return Array.isArray(values) && values.includes(fieldVal);
    }
    if ('==' in cond || '===' in cond) {
      const op = '==' in cond ? '==' : '===';
      const [left, right] = cond[op];
      return this.resolveVar(left, data) == this.resolveVar(right, data);
    }
    if ('>=' in cond) {
      const [left, right] = cond['>='];
      return Number(this.resolveVar(left, data)) >= Number(this.resolveVar(right, data));
    }
    if ('>' in cond) {
      const [left, right] = cond['>'];
      return Number(this.resolveVar(left, data)) > Number(this.resolveVar(right, data));
    }
    if ('<=' in cond) {
      const [left, right] = cond['<='];
      return Number(this.resolveVar(left, data)) <= Number(this.resolveVar(right, data));
    }
    if ('<' in cond) {
      const [left, right] = cond['<'];
      return Number(this.resolveVar(left, data)) < Number(this.resolveVar(right, data));
    }

    return false;
  }

  private resolveVar(ref: any, data: any): any {
    if (ref && typeof ref === 'object' && 'var' in ref) {
      return data[ref.var];
    }
    return ref;
  }

  /**
   * Compute risk score deterministically
   * Weights are tunable via configuration
   */
  computeRiskScore(data: ProjectData): { riskScore: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' } {
    let score = 0;

    // Pollution Category (0-70)
    const pollutionScores: Record<string, number> = {
      WHITE: 0, GREEN: 10, ORANGE: 40, RED: 70,
    };
    score += pollutionScores[data.pollutionCategory || 'WHITE'] || 0;

    // Hazardous (+15)
    if (data.hasHazardousSubstances) score += 15;

    // Ecologically Sensitive (+10)
    if (data.ecologicallySensitive) score += 10;

    // Investment score (0-20)
    const inv = data.totalInvestmentLakhs || 0;
    if (inv >= 1000) score += 20;        // > 10 Cr
    else if (inv >= 500) score += 15;    // 5-10 Cr
    else if (inv >= 100) score += 10;    // 1-5 Cr
    else if (inv >= 25) score += 5;      // 25L-1Cr
    // < 25L: 0

    // Building height (+5)
    if ((data.buildingHeight || 0) > 15) score += 5;

    // High water/power (+5 max)
    let utilityScore = 0;
    if ((data.powerKW || 0) > 1000) utilityScore += 3;
    if ((data.waterRequirementKLD || 0) > 500) utilityScore += 2;
    score += Math.min(5, utilityScore);

    // Manpower > 500 (+5)
    if ((data.employeeCount || 0) > 500) score += 5;

    // Cap at 100
    score = Math.min(100, score);

    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 
      score <= 30 ? 'LOW' : score <= 60 ? 'MEDIUM' : 'HIGH';

    return { riskScore: score, riskLevel };
  }
}
