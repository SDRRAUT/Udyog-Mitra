'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/auth';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import {
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  TrendingUp,
  Download,
  Calendar,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { StatCard } from '@/components/app/StatCard';
import { SLAClock } from '@/components/app/SLAClock';
import { RiskBadge } from '@/components/app/RiskBadge';
import { PageHeader } from '@/components/app/PageHeader';
import { cn } from '@/lib/utils';
import { CardSpotlight } from '@/components/ui/aceternity';

export default function EntrepreneurDashboard() {
  const { user } = useAuthStore();
  const { on } = useSocket();

  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = () => {
    setIsLoading(true);
    api.applications
      .list()
      .then((data) => {
        setApplications(data || []);
      })
      .catch((err) => {
        console.error('Error fetching applications:', err);
        // Fallback demo applications
        setApplications([
          {
            id: 'app-2026-0042',
            applicationNo: 'APP-2026-0042',
            businessName: 'Rahul Foods & Dairy Agro Ltd',
            sector: 'Agro & Food Processing',
            locationType: 'MIDC',
            district: { name: 'Pune' },
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            approvals: [
              {
                id: 'ap1',
                approvalMaster: { name: 'Consent to Establish (CTE)' },
                department: { code: 'MPCB', name: 'MPCB' },
                status: 'UNDER_SCRUTINY',
                slaDays: 30,
                dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 'ap2',
                approvalMaster: { name: 'Factory Plan Approval' },
                department: { code: 'DISH', name: 'DISH' },
                status: 'QUERY_RAISED',
                slaDays: 30,
                dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 'ap3',
                approvalMaster: { name: 'Provisional Fire Safety NOC' },
                department: { code: 'FIRE', name: 'Fire' },
                status: 'INSPECTION_PENDING',
                slaDays: 15,
                dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: 'ap4',
                approvalMaster: { name: 'Building Plan Approval' },
                department: { code: 'MIDC', name: 'MIDC' },
                status: 'APPROVED',
                slaDays: 30,
                dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ],
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Real-time live status updates via WebSockets
  useEffect(() => {
    const unsub1 = on('application_status_updated', () => fetchApplications());
    const unsub2 = on('query_raised', () => fetchApplications());
    const unsub3 = on('inspection_scheduled', () => fetchApplications());
    return () => {
      unsub1?.();
      unsub2?.();
      unsub3?.();
    };
  }, [on]);

  const activeApp = applications[0] || null;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title="Industrial Clearance Dashboard"
        description="Monitor end-to-end statutory clearances for your manufacturing enterprise in Maharashtra under RTS Act 2015."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            MIDC Pune Industrial Zone
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/entrepreneur/onboarding">
              <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                Find More Approvals
              </Button>
            </Link>
            <Link href="/applications/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                New Clearance CAF
              </Button>
            </Link>
          </div>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* GREETING & BILINGUAL SUB-HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
          <div>
            <div className="text-base font-semibold text-[var(--text)]">
              Welcome back, {user?.name || 'Rahul Patil'}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              उद्योग डॅशबोर्ड · {user?.entrepreneurProfile?.businessName || 'Rahul Foods & Dairy Agro Ltd'}
            </div>
          </div>
          <div className="text-xs font-mono text-[var(--text-subtle)]">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* ACTION REQUIRED BANNER (Warning Tint) */}
        <div className="p-4 rounded-xl bg-[var(--warning-bg)] border border-[#FEDF89] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--warning-text)]">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[var(--warning-text)] shrink-0" />
            <div>
              <span className="font-semibold">Action Required: DISH Query Notice</span>
              <span className="text-[var(--text-muted)] block sm:inline sm:ml-1.5">
                Officer requested clarified factory layout machine gangway spacing.
              </span>
            </div>
          </div>
          <Link href="/entrepreneur/checklist" className="shrink-0">
            <Button variant="primary" size="sm">
              Reply to Query Notice
            </Button>
          </Link>
        </div>

        {/* TOP STATCARDS (Fintech Calm) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total Clearances"
            value={activeApp ? activeApp.approvals?.length || 4 : 4}
            subtitle="Pre-establishment pipeline"
            sparklineData={[1, 2, 3, 4]}
          />
          <StatCard
            label="Granted Clearances"
            value={1}
            delta={{ value: 'MIDC Plan', trend: 'up' }}
            subtitle="Digitally signed & issued"
            sparklineData={[0, 0, 1, 1]}
          />
          <StatCard
            label="Under Scrutiny"
            value={2}
            delta={{ value: 'In Parallel', trend: 'up' }}
            subtitle="MPCB & Fire in parallel"
            sparklineData={[3, 3, 2, 2]}
          />
          <StatCard
            label="Action Required"
            value={1}
            delta={{ value: 'DISH Query', trend: 'down' }}
            subtitle="Reply to resume timer"
            sparklineData={[0, 1, 1, 1]}
          />
        </div>

        {/* BENTO GRID (12 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LARGE (Col 8): Active Application Card with per-department progress */}
          <div className="lg:col-span-8 surface-card p-5 space-y-4 border-[var(--border-strong)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--text)]">
                    {activeApp?.applicationNo || 'APP-2026-0042'}
                  </span>
                  <StatusPill status="UNDER_SCRUTINY" label="Processing in Parallel" />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)] mt-0.5">
                  {activeApp?.businessName || 'Rahul Foods & Dairy Agro Ltd'}
                </h3>
              </div>
              <Link href={`/entrepreneur/application/${activeApp?.id || 'app-2026-0042'}`}>
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Full Dossier
                </Button>
              </Link>
            </div>

            {/* Department Approvals Breakdown Grid */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Simultaneous Departmental Scrutiny:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeApp?.approvals?.map((ap: any) => (
                  <CardSpotlight
                    key={ap.id}
                    spotlightColor="rgba(42, 71, 201, 0.08)"
                    className="p-3.5 space-y-2 select-none"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[var(--text)]">
                        {ap.department?.code}
                      </span>
                      <StatusPill status={ap.status} />
                    </div>

                    <div className="text-xs font-medium text-[var(--text)] truncate">
                      {ap.approvalMaster?.name}
                    </div>

                    <div className="pt-1 border-t border-[var(--border)] flex items-center justify-between">
                      <SLAClock dueDate={ap.dueDate} size="sm" isPaused={ap.status === 'QUERY_RAISED'} />
                    </div>
                  </CardSpotlight>
                ))}
              </div>
            </div>
          </div>

          {/* SIDE (Col 4): Schemes you're eligible for (Estimated Benefit) */}
          <div className="lg:col-span-4 surface-card p-5 space-y-4 border-[var(--border-strong)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">Eligible Subsidies (PSI)</h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Matched via Maharashtra Industrial Policy 2024
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-[var(--accent-500)]" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[var(--success-bg)] border border-[#A6F4C5] space-y-1">
                <div className="text-[11px] text-[var(--text-muted)]">Estimated Financial Benefit</div>
                <div className="text-2xl font-bold font-mono text-[var(--success-text)]">
                  ₹42.5 Lakhs
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">
                  Zone B Capital Subsidy + 5-Year Power Tariff Rebate
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text)]">40% Capital Subsidy</span>
                  <span className="text-[10px] font-mono text-[var(--success-text)] font-semibold">
                    100% Match
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text)]">100% Stamp Duty Waiver</span>
                  <span className="text-[10px] font-mono text-[var(--success-text)] font-semibold">
                    Eligible
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                  <span className="font-medium text-[var(--text)]">₹1.50/Unit Power Subsidy</span>
                  <span className="text-[10px] font-mono text-[var(--success-text)] font-semibold">
                    Eligible
                  </span>
                </div>
              </div>

              <Link href="/entrepreneur/schemes" className="block pt-1">
                <Button variant="secondary" size="sm" className="w-full" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                  Explore & Claim Subsidies
                </Button>
              </Link>
            </div>
          </div>

          {/* LOWER ROW (Col 6): Compliance Calendar Next Due */}
          <div className="lg:col-span-6 surface-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">Compliance Calendar</h3>
                <p className="text-[11px] text-[var(--text-muted)]">Upcoming statutory returns and renewals</p>
              </div>
              <Calendar className="w-4 h-4 text-[var(--primary-600)]" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[var(--text)]">MPCB Environmental Statement (Form V)</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Due by 30th September · Annual</div>
                </div>
                <span className="font-mono text-xs font-semibold text-[var(--primary-600)] bg-[var(--primary-50)] px-2 py-0.5 rounded border border-[var(--primary-200)]">
                  34d left
                </span>
              </div>

              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[var(--text)]">DISH Factory Safety Return (Form 27)</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Due by 31st January · Half-Yearly</div>
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)]">
                  Upcoming
                </span>
              </div>
            </div>

            <Link href="/entrepreneur/compliance" className="block pt-1">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View Full Annual Compliance Calendar →
              </Button>
            </Link>
          </div>

          {/* LOWER ROW (Col 6): Recent Real-Time Activity */}
          <div className="lg:col-span-6 surface-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">Recent Activity Timeline</h3>
                <p className="text-[11px] text-[var(--text-muted)]">Live statutory log from connected departments</p>
              </div>
              <Clock className="w-4 h-4 text-[var(--primary-600)]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#12B76A] mt-1 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-medium text-[var(--text)]">MIDC Building Plan Sanctioned</div>
                  <div className="text-[10px] text-[var(--text-subtle)]">
                    Architectural layout digitally approved by Special Planning Authority · 2h ago
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[var(--warning)] mt-1 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-medium text-[var(--text)]">DISH Query Notice Received</div>
                  <div className="text-[10px] text-[var(--text-subtle)]">
                    Machine gangway dimension objection raised · 4h ago
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#7A5AF8] mt-1 shrink-0" />
                <div className="space-y-0.5">
                  <div className="font-medium text-[var(--text)]">Joint Site Inspection Coordinated</div>
                  <div className="text-[10px] text-[var(--text-subtle)]">
                    Combined inspection slot scheduled for 5th Oct · Yesterday
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
