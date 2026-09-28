'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  HelpCircle,
  Layers,
  Sparkles,
  GitBranch,
  ExternalLink,
  Zap,
  Lock,
  MessageSquare,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader } from '@/components/app/PageHeader';
import { CitationChip } from '@/components/app/CitationChip';
import { cn } from '@/lib/utils';
import { AnimatedTabs, CardSpotlight } from '@/components/ui/aceternity';

export default function DynamicChecklistPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'LIST' | 'GRAPH'>('LIST');
  const [expandedId, setExpandedId] = useState<string | null>('mpcb-cte');

  const stage1Approvals = [
    {
      id: 'midc-plan',
      code: 'MIDC_PLAN',
      name: 'MIDC Building Plan & Layout Approval',
      department: 'MIDC',
      deptName: 'Maharashtra Industrial Development Corporation',
      type: 'MANDATORY',
      slaDays: 30,
      fee: '₹15,000',
      parallel: true,
      whyRequired:
        'Mandatory under Maharashtra Regional and Town Planning Act (MRTP Act 1966) and MIDC Building Regulations 2020 before undertaking any civil construction in notified industrial zones.',
      ruleSource: 'MIDC Building Regulations 2020 §4(b)',
      citation: {
        id: 1,
        source: 'MIDC Development Control Regulations 2020',
        section: 'Rule 4(b) - Building Sanctions',
        text: 'All industrial factory buildings, sheds and godowns constructed on MIDC plots require prior architectural layout approval from the Special Planning Authority.',
      },
      requiredDocs: [
        'Architectural Blueprint with True North',
        'Structural Stability Certificate',
        'Plot Possession Allotment Letter',
      ],
      dependency: null,
    },
    {
      id: 'mpcb-cte',
      code: 'MPCB_CTE',
      name: 'MPCB Consent to Establish (CTE) - Orange Category',
      department: 'MPCB',
      deptName: 'Maharashtra Pollution Control Board',
      type: 'MANDATORY',
      slaDays: 30,
      fee: '₹25,000',
      parallel: true,
      whyRequired:
        'Your unit is classified as ORANGE category (Food Processing) in the Pre-establishment stage. Water (Prevention & Control of Pollution) Act 1974 Section 25 and Air Act 1981 Section 21 mandate CTE prior to installing plant & machinery.',
      ruleSource: 'Water Act 1974 §25 & Air Act 1981 §21',
      citation: {
        id: 2,
        source: 'Water (Prevention & Control of Pollution) Act 1974',
        section: 'Section 25 - Consent of State Board',
        text: 'No person shall, without the previous consent of the State Board, establish or take any steps to establish any industry or operation which is likely to discharge sewage or trade effluent.',
        url: 'https://mpcb.gov.in',
      },
      requiredDocs: [
        'Certified Effluent Treatment Plant (ETP) Flow Diagram',
        'Site Plan with Geo-Coordinates',
        'Environmental Management Plan (EMP)',
      ],
      dependency: null,
    },
    {
      id: 'dish-plan',
      code: 'DISH_PLAN',
      name: 'Factory Plan Approval (Safety, Ventilation & Health)',
      department: 'DISH',
      deptName: 'Directorate of Industrial Safety & Health',
      type: 'MANDATORY',
      slaDays: 30,
      fee: '₹8,000',
      parallel: true,
      whyRequired:
        'Section 6 of Factories Act 1948 and Maharashtra Factory Rules 1963 require prior scrutiny of machine layout, internal gangways, fire exits, and worker ventilation before erection.',
      ruleSource: 'Factories Act 1948 §6 / MH Factory Rules 1963',
      citation: {
        id: 3,
        source: 'Maharashtra Factory Rules 1963',
        section: 'Rule 3 - Approval of Plans',
        text: 'No building shall be constructed, reconstructed, extended or taken into use as a factory or part of a factory unless the plans are previously approved by the Chief Inspector.',
      },
      requiredDocs: [
        'Manufacturing Process Flow Chart',
        'Machine Layout Blueprint',
        'Emergency Exit Ratio Drawing',
      ],
      dependency: null,
    },
    {
      id: 'fire-noc-prov',
      code: 'FIRE_PROV',
      name: 'Provisional Fire Safety NOC',
      department: 'FIRE',
      deptName: 'Maharashtra Fire Services',
      type: 'CONDITIONAL',
      slaDays: 15,
      fee: '₹5,000',
      parallel: true,
      whyRequired:
        'Required for industrial structures to ensure compliant underground static water tanks, hydrant coverage, and clear 6-metre turning radius for fire tenders.',
      ruleSource: 'MH Fire Prevention & Life Safety Act 2006',
      citation: {
        id: 4,
        source: 'Maharashtra Fire Act 2006',
        section: 'Section 3(1) - Minimum Fire Safety Standards',
        text: 'Owner of factory or manufacturing building shall obtain provisional fire certificate before laying foundations.',
      },
      requiredDocs: [
        'Internal Fire Hydrant Layout',
        'Underground Static Water Reservoir Plan',
      ],
      dependency: 'Needs: Building Plan Approval',
    },
    {
      id: 'msedcl-power',
      code: 'MSEDCL_HT',
      name: 'High-Tension (HT) Power Feasibility & Sanction',
      department: 'MSEDCL',
      deptName: 'Maharashtra State Electricity Distribution Co.',
      type: 'MANDATORY',
      slaDays: 14,
      fee: '₹12,000',
      parallel: true,
      whyRequired:
        'Connected load of 120 KW exceeds LT threshold (100 KW) and necessitates technical sub-station clearance and transformer metering sanctions.',
      ruleSource: 'MERC Supply Code 2021 Regulation 4.2',
      requiredDocs: [
        'Single Line Diagram (SLD) of Electrical Substation',
        'Certified Connected Load Test Report',
      ],
      dependency: null,
    },
  ];

  const stage2Approvals = [
    {
      id: 'mpcb-cto',
      code: 'MPCB_CTO',
      name: 'MPCB Consent to Operate (CTO)',
      department: 'MPCB',
      deptName: 'Maharashtra Pollution Control Board',
      type: 'MANDATORY',
      slaDays: 30,
      fee: '₹25,000',
      parallel: false,
      whyRequired:
        'Prerequisite to actual commercial manufacturing. Granted after on-site verification of ETP and compliance with Consent to Establish (CTE) norms.',
      ruleSource: 'Water Act 1974 §25 & Air Act 1981 §21',
      requiredDocs: [
        'Commissioning Report of ETP / STP',
        'Stack Monitoring & Emission Test Certificate',
        'Hazardous Waste Manifest Form 10',
      ],
      dependency: 'Locked: Unlocks after MPCB CTE Approval',
    },
    {
      id: 'dish-license',
      code: 'DISH_LICENSE',
      name: 'Factory License (DISH)',
      department: 'DISH',
      deptName: 'Directorate of Industrial Safety & Health',
      type: 'MANDATORY',
      slaDays: 30,
      fee: '₹10,000',
      parallel: false,
      whyRequired:
        'Issued under Section 6 of Factories Act 1948 before employing workers and turning on industrial power for trial runs.',
      ruleSource: 'Factories Act 1948 §6',
      requiredDocs: [
        'Stability Certificate Form 1A',
        'Notice of Occupation Form 2',
        'Safety Committee Constitution Minutes',
      ],
      dependency: 'Locked: Unlocks after Factory Plan Sanction',
    },
    {
      id: 'fire-final',
      code: 'FIRE_FINAL',
      name: 'Final Fire Safety NOC',
      department: 'FIRE',
      deptName: 'Maharashtra Fire Services',
      type: 'CONDITIONAL',
      slaDays: 15,
      fee: '₹7,500',
      parallel: false,
      whyRequired:
        'Issued post joint site inspection to certify working pressure in hydrants and functioning smoke detectors.',
      ruleSource: 'MH Fire Prevention Act 2006',
      requiredDocs: [
        'Fire Fighting System Testing Certificate',
        'Emergency Evacuation Drill Log',
      ],
      dependency: 'Locked: Unlocks after Provisional Fire NOC & Building Completion',
    },
    {
      id: 'labour-clra',
      code: 'LABOUR_CLRA',
      name: 'Contract Labour Registration (CLRA)',
      department: 'LABOUR',
      deptName: 'Labour Commissionerate Maharashtra',
      type: 'MANDATORY',
      slaDays: 7,
      fee: '₹2,500',
      parallel: true,
      whyRequired:
        'Mandatory under Section 7 of CLRA Act 1970 for establishments engaging 20 or more contract workmen.',
      ruleSource: 'Contract Labour (Regulation & Abolition) Act 1970 §7',
      requiredDocs: [
        'Form I - Principal Employer Registration Application',
        'Contractor Service Agreements',
      ],
      dependency: null,
    },
  ];

  const externalApprovals = [
    {
      id: 'fssai-central',
      code: 'FSSAI_MFG',
      name: 'FSSAI Central Manufacturing License',
      department: 'FSSAI',
      deptName: 'Food Safety and Standards Authority of India (Central Portal)',
      type: 'EXTERNAL',
      slaDays: 30,
      fee: '₹7,500',
      parallel: false,
      whyRequired:
        'Central statutory license required for manufacturing proprietary dairy and snack foods under FSS Act 2006.',
      ruleSource: 'FSS (Licensing & Registration of Food Businesses) 2011',
      requiredDocs: [
        'Food Safety Management System (FSMS) Plan',
        'Water Potability Analysis Report (IS 10500)',
      ],
      dependency: 'Seamless API Sync: UDYOG MITRA autofills FoSCoS portal',
    },
  ];

  const totalMandatory = 6;
  const totalConditional = 2;
  const totalExternal = 1;

  const handleStartCAF = () => {
    router.push('/applications/new');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      {/* Page Header */}
      <PageHeader
        title="Your Approval Roadmap"
        description="Dynamic deductions generated by Maharashtra Industrial Policy 2024 Rule Engine. Pre-establishment approvals run in parallel to compress statutory lead time from 180 days down to 65 days."
        badge={
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusPill status="MANDATORY" label="6 Mandatory" />
            <StatusPill status="CONDITIONAL" label="2 Conditional" />
            <StatusPill status="EXTERNAL" label="1 External" />
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <AnimatedTabs
              tabs={[
                { id: 'LIST', label: 'Checklist List' },
                { id: 'GRAPH', label: 'Dependency Graph' },
              ]}
              activeTab={viewMode}
              onChange={(id) => setViewMode(id as any)}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartCAF}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Start Common Application (CAF)
            </Button>
          </div>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* HERO SUMMARY CARD: Sequential 180d vs UDYOG MITRA 65d with Spotlight */}
        <CardSpotlight
          spotlightColor="rgba(42, 71, 201, 0.08)"
          className="p-5 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[var(--primary-600)]" />
                <span>Statutory Time Compression Benchmark</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Based on Maharashtra Right to Public Services Act (RTS 2015) maximum permissible SLA windows.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-[var(--text-muted)]">Time Saved:</span>{' '}
              <span className="text-sm font-bold font-mono text-[var(--success-text)] bg-[var(--success-bg)] px-2 py-0.5 rounded-full border border-[#A6F4C5]">
                115 Days (-64%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Sequential 180 Days */}
            <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Sequential Dept-by-Dept Route:</span>
                <span className="font-mono font-semibold text-[var(--text-subtle)] line-through">
                  180 Working Days
                </span>
              </div>
              <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--text-subtle)] h-full w-full opacity-60" />
              </div>
              <div className="text-[10px] text-[var(--text-subtle)]">
                Legacy process: MPCB CTE awaits Building Sanction awaits Revenue NA
              </div>
            </div>

            {/* Parallel 65 Days */}
            <div className="p-3.5 rounded-xl bg-[var(--primary-50)] border border-[var(--primary-200)] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--primary-900)] flex items-center gap-1">
                  <span>With UDYOG MITRA Orchestrated Routing:</span>
                </span>
                <span className="font-mono font-bold text-sm text-[var(--primary-600)]">
                  65 Working Days
                </span>
              </div>
              <div className="w-full bg-[var(--primary-200)] h-2 rounded-full overflow-hidden">
                <div className="bg-[var(--primary-600)] h-full w-[36%] transition-all duration-700" />
              </div>
              <div className="text-[10px] text-[var(--primary-700)]">
                Parallel routing: MPCB, MIDC & DISH reviews initiate simultaneously on Day 1
              </div>
            </div>
          </div>
        </CardSpotlight>

        {/* VIEW MODE TOGGLE CONTENT: LIST vs GRAPH */}
        {viewMode === 'LIST' ? (
          <div className="space-y-6">
            {/* STAGE 1: PRE-ESTABLISHMENT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] font-mono text-xs font-bold flex items-center justify-center border border-[var(--primary-200)]">
                    1
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text)]">
                      Stage 1: Pre-Establishment Clearances (Parallel Processing)
                    </h2>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Required before commencing factory construction or site foundation work.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--text-subtle)]">
                  {stage1Approvals.length} Clearances
                </span>
              </div>

              {/* Approval Rows */}
              <div className="space-y-2">
                {stage1Approvals.map((app) => {
                  const isExpanded = expandedId === app.id;
                  return (
                    <div
                      key={app.id}
                      className={cn(
                        'surface-card overflow-hidden transition-all',
                        isExpanded && 'border-[var(--primary-500)] shadow-sm'
                      )}
                    >
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-[var(--surface-2)] transition select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-8 h-8 rounded-lg bg-[var(--primary-50)] text-[var(--primary-600)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--primary-200)]">
                            {app.department}
                          </span>
                          <div className="truncate">
                            <div className="text-sm font-semibold text-[var(--text)] truncate">
                              {app.name}
                            </div>
                            <div className="text-xs text-[var(--text-muted)] truncate">
                              {app.deptName}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {app.parallel && (
                            <span
                              className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]"
                              title="Runs in parallel with other departmental clearances"
                            >
                              <Zap className="w-3 h-3 text-[var(--primary-600)]" />
                              <span>Parallel</span>
                            </span>
                          )}

                          <StatusPill status={app.type} />

                          <div className="text-right hidden sm:block">
                            <div className="text-xs font-mono font-semibold text-[var(--text)]">
                              {app.slaDays} Days SLA
                            </div>
                            <div className="text-[10px] font-mono text-[var(--text-subtle)]">
                              Fee: {app.fee}
                            </div>
                          </div>

                          <button
                            type="button"
                            className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)]"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* INLINE EXPANSION EXPLAINER */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-[var(--border)] bg-[var(--surface)] space-y-3 animate-in fade-in duration-150">
                          {/* Why required block with primary left border */}
                          <div className="p-3 rounded-r-lg bg-[var(--surface-2)] border-l-2 border-[var(--primary-600)] space-y-1.5">
                            <div className="text-xs font-semibold text-[var(--text)] flex items-center justify-between">
                              <span>Why is this clearance required?</span>
                              {app.citation && (
                                <CitationChip citation={app.citation} index={0} />
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                              {app.whyRequired}
                            </p>
                            <div className="text-[11px] font-mono text-[var(--text-subtle)] pt-1 flex items-center gap-1">
                              <span>Statutory Rule:</span>
                              <span className="font-semibold text-[var(--text)]">{app.ruleSource}</span>
                            </div>
                          </div>

                          {/* Required Documents */}
                          <div className="space-y-1.5">
                            <div className="text-xs font-semibold text-[var(--text)]">
                              Required Statutory Documents ({app.requiredDocs.length})
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {app.requiredDocs.map((doc, idx) => (
                                <div
                                  key={idx}
                                  className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-1 text-xs"
                                >
                                  <span className="truncate text-[var(--text-muted)]">{doc}</span>
                                  <button
                                    type="button"
                                    className="text-[10px] font-medium text-[var(--primary-600)] hover:underline shrink-0"
                                  >
                                    Sample
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                            <div className="text-[11px] text-[var(--text-subtle)]">
                              Single CAF automatically forwards all fields to {app.department}
                            </div>
                            <Link
                              href="/entrepreneur/chat"
                              className="text-xs font-medium text-[var(--primary-600)] hover:underline flex items-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Ask MAHA-MITRA about {app.department} requirements</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STAGE 2: PRE-OPERATION */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--surface-3)] text-[var(--text)] font-mono text-xs font-bold flex items-center justify-center border border-[var(--border-strong)]">
                    2
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text)]">
                      Stage 2: Pre-Operation Clearances (Post-Construction)
                    </h2>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Locked during construction. Unlocks sequentially after CTE & Plan sanctions are approved.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--text-subtle)]">
                  {stage2Approvals.length} Clearances
                </span>
              </div>

              <div className="space-y-2">
                {stage2Approvals.map((app) => (
                  <div
                    key={app.id}
                    className="surface-card p-4 flex items-center justify-between gap-3 opacity-80 hover:opacity-100 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--border)]">
                        {app.department}
                      </span>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-[var(--text)] truncate">
                          {app.name}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate flex items-center gap-1.5 min-w-0">
                          <span className="shrink-0">{app.deptName}</span>
                          <span className="text-[var(--border-strong)] shrink-0">·</span>
                          <span className="text-[var(--text-subtle)] flex items-center gap-1 min-w-0 truncate">
                            <Lock className="w-3 h-3 text-[var(--text-subtle)] shrink-0" />
                            <span className="truncate">{app.dependency}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusPill status="LOCKED" label="Stage 2 Locked" />
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-mono font-medium text-[var(--text-muted)]">
                          {app.slaDays} Days SLA
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STAGE 3: EXTERNAL CENTRAL CLEARANCES */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--surface-3)] text-[var(--text)] font-mono text-xs font-bold flex items-center justify-center border border-[var(--border-strong)]">
                    3
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text)]">
                      Stage 3: Central Govt Portals (Seamless API Sync)
                    </h2>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      UDYOG MITRA passes common application fields directly to Central ministries via API integration.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[var(--text-subtle)]">
                  {externalApprovals.length} Central Gateway
                </span>
              </div>

              <div className="space-y-2">
                {externalApprovals.map((app) => (
                  <div
                    key={app.id}
                    className="surface-card p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-[var(--surface-2)] text-[var(--text)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--border)]">
                        {app.department}
                      </span>
                      <div className="truncate">
                        <div className="text-sm font-semibold text-[var(--text)] truncate">
                          {app.name}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate">
                          {app.deptName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusPill status="EXTERNAL" label="Central Sync" />
                      <div className="text-right hidden sm:block">
                        <div className="text-xs font-mono font-medium text-[var(--text-muted)]">
                          {app.slaDays} Days
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* DEPENDENCY GRAPH VIEW */
          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Clearances Dependency Graph (Topological Sort)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Green boxes run in parallel on Day 1. Orange boxes require antecedent clearances.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-600)]" />
                  <span>Parallel Ready</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-subtle)]" />
                  <span>Dependent (Locked)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Day 1 Parallel Group */}
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[var(--primary-50)] border border-[var(--primary-200)] text-center text-xs font-semibold text-[var(--primary-900)]">
                  Day 1: Parallel Intake (CAF Submission)
                </div>
                <div className="space-y-2.5">
                  <div className="surface-card p-3 border-[var(--primary-500)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>MIDC Plan Approval</span>
                      <StatusPill status="MANDATORY" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">SPA · 30 Days SLA</div>
                  </div>

                  <div className="surface-card p-3 border-[var(--primary-500)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>MPCB CTE (Orange)</span>
                      <StatusPill status="MANDATORY" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">SRO Pune · 30 Days SLA</div>
                  </div>

                  <div className="surface-card p-3 border-[var(--primary-500)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>DISH Factory Layout</span>
                      <StatusPill status="MANDATORY" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">Safety Directorate · 30 Days</div>
                  </div>

                  <div className="surface-card p-3 border-[var(--primary-500)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>MSEDCL HT Load</span>
                      <StatusPill status="MANDATORY" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">Substation Feasibility · 14 Days</div>
                  </div>
                </div>
              </div>

              {/* Dependent Group */}
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-center text-xs font-semibold text-[var(--text)]">
                  Day 31: Post-Sanctions & Civil Work
                </div>
                <div className="space-y-2.5">
                  <div className="surface-card p-3 border-[var(--border)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Provisional Fire NOC</span>
                      <StatusPill status="CONDITIONAL" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Antecedent: MIDC Building Plan
                    </div>
                  </div>

                  <div className="surface-card p-3 border-[var(--border)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>CLRA Labour Registration</span>
                      <StatusPill status="MANDATORY" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Antecedent: Contractor Agreements
                    </div>
                  </div>
                </div>
              </div>

              {/* Commissioning Group */}
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-center text-xs font-semibold text-[var(--text)]">
                  Day 65: Pre-Operations Trial
                </div>
                <div className="space-y-2.5">
                  <div className="surface-card p-3 border-[var(--border)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>MPCB CTO (Operate)</span>
                      <StatusPill status="LOCKED" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Antecedent: CTE + ETP Commissioning
                    </div>
                  </div>

                  <div className="surface-card p-3 border-[var(--border)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Factory License (DISH)</span>
                      <StatusPill status="LOCKED" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Antecedent: Building Completion + Form 1A
                    </div>
                  </div>

                  <div className="surface-card p-3 border-[var(--border)] space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>Final Fire NOC</span>
                      <StatusPill status="LOCKED" />
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      Antecedent: Joint Site Inspection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA Bar */}
        <div className="surface-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-[var(--border-strong)]">
          <div className="space-y-0.5 text-center sm:text-left">
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Ready to submit your clearances through one single window?
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Your answers from the Smart Profile questionnaire have been pre-filled into the Maharashtra Common Application Form (CAF).
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleStartCAF}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Open Common Application Form (CAF)
          </Button>
        </div>
      </main>
    </div>
  );
}
