'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusPill } from '@/components/ui/StatusPill';
import { Kbd } from '@/components/ui/Kbd';
import { Skeleton } from '@/components/ui/Skeleton';
import { SLAClock } from '@/components/app/SLAClock';
import { RiskBadge } from '@/components/app/RiskBadge';
import { StatCard } from '@/components/app/StatCard';
import { PageHeader } from '@/components/app/PageHeader';
import { LiveIndicator } from '@/components/app/LiveIndicator';
import { LanguageSwitcher } from '@/components/app/LanguageSwitcher';
import { CitationChip } from '@/components/app/CitationChip';
import { EmptyState } from '@/components/app/EmptyState';
import { CommandPalette } from '@/components/app/CommandPalette';
import {
  FileText,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
  Command,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

export default function DesignSystemPage() {
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-20">
      {/* Page Header */}
      <PageHeader
        title="UDYOG MITRA Design System Specification"
        description="Anti-vibe-coded token library, UI primitives, and domain interaction components adhering to GOV.UK, UX4G, Linear, and Stripe standards."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            WCAG 2.2 AA · Phase 1
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <LiveIndicator isConnected={true} />
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Command className="w-3.5 h-3.5" />}
              onClick={() => setIsCmdOpen(true)}
            >
              Open ⌘K Palette
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* SECTION 1: Color Tokens */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                1. Design Tokens & Palette (Part C2)
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Calm authority palette: Setu Blue primary, Maharashtra Saffron for brand moments only.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="surface-card p-3 space-y-1.5">
              <div className="h-10 rounded bg-[#2A47C9]" />
              <div className="text-xs font-semibold">Setu Blue 600</div>
              <div className="text-[11px] font-mono text-[var(--text-subtle)]">#2A47C9 (Primary)</div>
            </div>
            <div className="surface-card p-3 space-y-1.5">
              <div className="h-10 rounded bg-[#F5821F]" />
              <div className="text-xs font-semibold">MH Saffron 500</div>
              <div className="text-[11px] font-mono text-[var(--text-subtle)]">#F5821F (Brand Accent)</div>
            </div>
            <div className="surface-card p-3 space-y-1.5">
              <div className="h-10 rounded bg-[#12B76A]" />
              <div className="text-xs font-semibold">Success Green</div>
              <div className="text-[11px] font-mono text-[var(--text-subtle)]">#12B76A (Approved/On-track)</div>
            </div>
            <div className="surface-card p-3 space-y-1.5">
              <div className="h-10 rounded bg-[#F79009]" />
              <div className="text-xs font-semibold">Warning Amber</div>
              <div className="text-[11px] font-mono text-[var(--text-subtle)]">#F79009 (Query/At-risk)</div>
            </div>
            <div className="surface-card p-3 space-y-1.5">
              <div className="h-10 rounded bg-[#F04438]" />
              <div className="text-xs font-semibold">Danger Rose</div>
              <div className="text-[11px] font-mono text-[var(--text-subtle)]">#F04438 (Breached/Reject)</div>
            </div>
            <div className="surface-card p-3 space-y-1.5">
              <div className="h-10 rounded bg-[#7A5AF8]" />
              <div className="text-xs font-semibold">Inspection Violet</div>
              <div className="text-[11px] font-mono text-[var(--text-subtle)]">#7A5AF8 (Joint Inspection)</div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Status Pills */}
        <section className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              2. Domain Status Pills (Height 22px, Radius Full, Tinted Surfaces)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Consistent across tables, timelines, checklists, and scrutiny records. Never saturated white-on-bright.
            </p>
          </div>

          <div className="surface-card p-5 space-y-4">
            <div>
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                Approval & Scrutiny Lifecyle
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill status="DRAFT" />
                <StatusPill status="LOCKED" />
                <StatusPill status="SUBMITTED" />
                <StatusPill status="UNDER_SCRUTINY" />
                <StatusPill status="QUERY_RAISED" />
                <StatusPill status="INSPECTION_PENDING" />
                <StatusPill status="RECOMMENDED" />
                <StatusPill status="APPROVED" />
                <StatusPill status="REJECTED" />
                <StatusPill status="RETURNED" />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                SLA & Applicability Tokens
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill status="ON_TRACK" />
                <StatusPill status="AT_RISK" />
                <StatusPill status="BREACHED" />
                <StatusPill status="PAUSED" />
                <StatusPill status="MANDATORY" />
                <StatusPill status="CONDITIONAL" />
                <StatusPill status="OPTIONAL" />
                <StatusPill status="EXTERNAL" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Buttons & Controls */}
        <section className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              3. Buttons & Interaction States
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Strict 32px / 36px / 44px sizing with subtle focus-visible rings and smooth transitions.
            </p>
          </div>

          <div className="surface-card p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger Muted</Button>
              <Button variant="dangerSolid">Reject (Confirm)</Button>
              <Button variant="link">Inline Link</Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[var(--border)]">
              <Button
                variant="primary"
                size="sm"
                loading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}
              >
                Click to Test Spinner
              </Button>
              <Button variant="secondary" size="sm" disabled>
                Disabled State
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Continue Step
              </Button>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <span>Keyboard hint:</span>
                <Kbd>⌘K</Kbd>
                <Kbd>Enter</Kbd>
                <Kbd>Esc</Kbd>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SLA Clock & Risk Badge */}
        <section className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              4. Domain Micro-Interactions (SLA Clock & Risk Badge)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              SLA depletion ring with 24h soft pulse, breach timestamp, and hover factor breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SLA Clocks */}
            <div className="surface-card p-5 space-y-4">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                SLA Countdown Rings
              </div>
              <div className="flex flex-col gap-3">
                <SLAClock
                  dueDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
                  size="md"
                />
                <SLAClock
                  dueDate={new Date(Date.now() + 20 * 60 * 60 * 1000)} // < 24h (At risk)
                  size="md"
                />
                <SLAClock
                  dueDate={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)} // Breached
                  size="md"
                />
                <SLAClock
                  dueDate={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
                  isPaused={true}
                  pausedReason="Awaiting MPCB query response"
                  size="md"
                />
              </div>
            </div>

            {/* Risk Badges */}
            <div className="surface-card p-5 space-y-4">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase">
                AI Risk Score with Hover Factors
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Hover over each badge to inspect specific environmental and industrial risk factors:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <RiskBadge score={22} level="LOW" />
                <RiskBadge score={58} level="MEDIUM" />
                <RiskBadge score={84} level="HIGH" />
              </div>

              <div className="pt-3 border-t border-[var(--border)]">
                <div className="text-xs font-semibold text-[var(--text-muted)] mb-1">
                  Perplexity Citation Chips:
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  According to the Maharashtra Industrial Policy 2024, Food Processing units in MIDC
                  enjoy 100% stamp duty exemption
                  <CitationChip
                    citation={{
                      id: 1,
                      source: 'Govt. Resolution No. IND-2024/CR-102',
                      section: 'Section 4.2 (Incentives)',
                      text: 'Eligible Agro & Food processing enterprises in D+ category districts are granted 100% stamp duty waiver for 5 years.',
                      url: 'https://industry.maharashtra.gov.in',
                    }}
                  />
                  and green category clearances are processed within 15 days
                  <CitationChip
                    citation={{
                      id: 2,
                      source: 'MPCB Notification RTS/2023',
                      section: 'Rule 8 (Deemed Approval)',
                      text: 'Green Category Consent to Establish (CTE) applications shall be deemed approved if not queried within 15 working days.',
                    }}
                  />.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: StatCards (Fintech Calm - Mercury/Ramp style) */}
        <section className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              5. Stat Cards & Live Numbers (Fintech Calm)
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Big numbers, soft surfaces, smooth numeric tick-up, subtle sparklines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Active Applications"
              value={142}
              delta={{ value: '+8 today', trend: 'up' }}
              subtitle="Processed across 8 departments"
              sparklineData={[90, 110, 105, 120, 135, 142]}
            />
            <StatCard
              label="SLA Compliance Rate"
              value={94.8}
              suffix="%"
              delta={{ value: '+1.4%', trend: 'up' }}
              subtitle="State SLA target: 92%"
              sparklineData={[88, 90, 92, 91, 93, 94.8]}
            />
            <StatCard
              label="Avg Clearance Time"
              value="18.4"
              suffix=" Days"
              delta={{ value: '-62% vs legacy', trend: 'up' }}
              subtitle="Down from 180 days"
              sparklineData={[65, 45, 32, 28, 22, 18.4]}
            />
            <StatCard
              label="At-Risk Clearances"
              value={7}
              delta={{ value: '-3 resolved', trend: 'down' }}
              subtitle="Nearing 24h SLA deadline"
              sparklineData={[15, 12, 11, 9, 8, 7]}
            />
          </div>
        </section>

        {/* SECTION 6: Form Inputs & Skeletons */}
        <section className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              6. Form Primitives & Loading Skeletons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="surface-card p-5 space-y-3">
              <Input
                placeholder="Industrial Unit Name (e.g. Pune Bio-Tech Agro)"
                leftIcon={<Search className="w-4 h-4" />}
              />
              <Input
                placeholder="Required Field with Validation Error"
                error="Factory Inspectorate approval is required for units with >20 workers"
                defaultValue="Sample Plant Site"
              />
              <Select defaultValue="pune">
                <option value="pune">Pune District (Chakan / Bhosari MIDC)</option>
                <option value="nagpur">Nagpur (Butibori Industrial Zone)</option>
                <option value="aurangabad">Chhatrapati Sambhajinagar (Shendra DMIC)</option>
              </Select>
            </div>

            <div className="surface-card p-5 space-y-3">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase mb-2">
                Layout-Matching Shimmer Skeletons
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-9 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: Empty State */}
        <section className="space-y-4">
          <div className="border-b border-[var(--border)] pb-2">
            <h2 className="text-lg font-semibold tracking-tight">
              7. Non-Vibe Empty State
            </h2>
          </div>
          <EmptyState
            icon={<FileText className="w-5 h-5" />}
            title="No pending queries for this application"
            description="All 4 departmental scrutiny officers have approved or forwarded their reviews without objections."
            actionLabel="View Scrutiny Timeline"
            secondaryActionLabel="Download Dossier"
          />
        </section>
      </div>

      {/* Global ⌘K Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </div>
  );
}
