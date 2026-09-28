'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import {
  ShieldAlert,
  Building2,
  TrendingUp,
  Award,
  AlertTriangle,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader } from '@/components/app/PageHeader';
import { StatCard } from '@/components/app/StatCard';
import { cn } from '@/lib/utils';
import { CardSpotlight, DotPattern } from '@/components/ui/aceternity';

export default function AdminPage() {
  const { on, isConnected } = useSocket();
  const [mounted, setMounted] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [stateStats, setStateStats] = useState({
    totalApplications: 14820,
    approvedClearances: 13950,
    underProcess: 720,
    rejected: 150,
    avgClearanceDays: 14.8,
    slaComplianceRate: 98.4,
    totalInvestmentCrores: 48500,
    breachesLast24h: 3,
  });

  const [liveEvents, setLiveEvents] = useState([
    { text: 'MPCB granted Consent to Establish for Precision Auto Works (Pune)', time: 'Just now', type: 'APPROVED' },
    { text: 'Single Window Joint Inspection scheduled for Sharma Food Industries (MIDC Bhosari)', time: '1 min ago', type: 'INSPECTION' },
    { text: 'DISH Safety Layout verified for Bajaj Auto Ltd (Waluj DMIC)', time: '3 mins ago', type: 'VERIFIED' },
    { text: 'SLA Escalation Triggered: Fire NOC Pune escalated to L2 HOD', time: '5 mins ago', type: 'ESCALATION' },
    { text: 'MSEDCL HT Load 250KW Sanctioned for Godavari Cold Storage (Nashik)', time: '8 mins ago', type: 'APPROVED' },
  ]);

  // Bottleneck Heatmap Data (Districts x Departments)
  const heatmapDistricts = [
    'Pune',
    'Thane',
    'Raigad',
    'Chhatrapati Sambhajinagar',
    'Nagpur',
    'Nashik',
  ];

  const heatmapDepartments = [
    { code: 'MPCB', name: 'Pollution Control' },
    { code: 'DISH', name: 'Industrial Safety' },
    { code: 'FIRE', name: 'Fire Services' },
    { code: 'MIDC', name: 'Industrial Development' },
    { code: 'REVENUE', name: 'Revenue / NA' },
    { code: 'LABOUR', name: 'Labour Welfare' },
  ];

  const heatmapMatrix: Record<string, Record<string, { pending: number; breached: number; avgTAT: number }>> = {
    Pune: {
      MPCB: { pending: 42, breached: 1, avgTAT: 14.2 },
      DISH: { pending: 35, breached: 2, avgTAT: 16.5 },
      FIRE: { pending: 18, breached: 3, avgTAT: 18.2 },
      MIDC: { pending: 22, breached: 0, avgTAT: 7.1 },
      REVENUE: { pending: 15, breached: 0, avgTAT: 22.0 },
      LABOUR: { pending: 12, breached: 0, avgTAT: 5.4 },
    },
    Thane: {
      MPCB: { pending: 38, breached: 1, avgTAT: 15.1 },
      DISH: { pending: 28, breached: 0, avgTAT: 14.8 },
      FIRE: { pending: 20, breached: 1, avgTAT: 14.5 },
      MIDC: { pending: 18, breached: 0, avgTAT: 6.8 },
      REVENUE: { pending: 12, breached: 1, avgTAT: 24.5 },
      LABOUR: { pending: 8, breached: 0, avgTAT: 4.8 },
    },
    Raigad: {
      MPCB: { pending: 31, breached: 2, avgTAT: 18.4 },
      DISH: { pending: 24, breached: 1, avgTAT: 17.2 },
      FIRE: { pending: 14, breached: 0, avgTAT: 12.0 },
      MIDC: { pending: 16, breached: 0, avgTAT: 8.5 },
      REVENUE: { pending: 9, breached: 0, avgTAT: 19.8 },
      LABOUR: { pending: 6, breached: 0, avgTAT: 5.1 },
    },
    'Chhatrapati Sambhajinagar': {
      MPCB: { pending: 24, breached: 0, avgTAT: 13.5 },
      DISH: { pending: 19, breached: 0, avgTAT: 15.1 },
      FIRE: { pending: 11, breached: 0, avgTAT: 11.2 },
      MIDC: { pending: 14, breached: 0, avgTAT: 7.4 },
      REVENUE: { pending: 8, breached: 1, avgTAT: 26.0 },
      LABOUR: { pending: 5, breached: 0, avgTAT: 4.5 },
    },
    Nagpur: {
      MPCB: { pending: 20, breached: 0, avgTAT: 12.8 },
      DISH: { pending: 16, breached: 0, avgTAT: 13.9 },
      FIRE: { pending: 9, breached: 0, avgTAT: 10.5 },
      MIDC: { pending: 11, breached: 0, avgTAT: 6.5 },
      REVENUE: { pending: 7, breached: 0, avgTAT: 21.0 },
      LABOUR: { pending: 4, breached: 0, avgTAT: 4.2 },
    },
    Nashik: {
      MPCB: { pending: 18, breached: 0, avgTAT: 11.9 },
      DISH: { pending: 14, breached: 0, avgTAT: 13.2 },
      FIRE: { pending: 8, breached: 0, avgTAT: 9.8 },
      MIDC: { pending: 10, breached: 0, avgTAT: 6.2 },
      REVENUE: { pending: 6, breached: 0, avgTAT: 18.5 },
      LABOUR: { pending: 3, breached: 0, avgTAT: 3.9 },
    },
  };

  const getHeatmapColor = (breached: number, pending: number) => {
    if (breached >= 3) return 'bg-[#FECDCA] text-[#B42318] border-[#FDA29B]';
    if (breached === 2) return 'bg-[#FEE4E2] text-[#B42318] border-[#FECDCA]';
    if (breached === 1) return 'bg-[#FEF3F2] text-[#B42318] border-[#FEE4E2]';
    if (pending > 30) return 'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]';
    return 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]';
  };

  // Recharts Turnaround Data
  const deptTurnaroundData = [
    { dept: 'MPCB', avgDays: 14.5, statutoryCap: 30 },
    { dept: 'DISH', avgDays: 16.1, statutoryCap: 30 },
    { dept: 'FIRE', avgDays: 11.8, statutoryCap: 15 },
    { dept: 'MIDC', avgDays: 7.2, statutoryCap: 30 },
    { dept: 'MSEDCL', avgDays: 9.5, statutoryCap: 14 },
    { dept: 'LABOUR', avgDays: 5.4, statutoryCap: 7 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title="State Command Center & Oversight"
        description="Unified industrial clearance orchestration for the Government of Maharashtra. Real-time SLA monitoring, bottleneck heatmaps, and automatic statutory escalations under RTS Act 2015."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            Mantralaya Industrial Cell · RTS Oversight
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--text-subtle)] hidden sm:inline">
              RTS 2015 Auto-Audit: Active
            </span>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Activity className="w-3.5 h-3.5" />}
              onClick={() => {
                setStateStats((prev) => ({
                  ...prev,
                  totalApplications: prev.totalApplications + 1,
                  approvedClearances: prev.approvedClearances + 1,
                }));
              }}
            >
              Simulate Live Event
            </Button>
          </div>
        }
      />

      {/* AUTO-SCROLLING LIVE EVENT TICKER (Part G13) */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] py-2 px-4 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--primary-600)] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--primary-600)] animate-pulse" />
            <span>LIVE STATE FEED:</span>
          </div>

          <div className="overflow-x-auto whitespace-nowrap flex items-center gap-6 text-xs text-[var(--text-muted)] hover:pause scrollbar-none">
            {liveEvents.map((evt, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <span className="text-[var(--text)] font-medium">{evt.text}</span>
                <span className="text-[10px] font-mono text-[var(--text-subtle)] bg-[var(--surface-2)] px-1.5 py-0.2 rounded border border-[var(--border)]">
                  {evt.time}
                </span>
                <span className="text-[var(--border-strong)]">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* TOP KPI ROW: 6 STATCARDS (Fintech Calm - Mercury / Ramp style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Total Clearances"
            value={stateStats.totalApplications}
            delta={{ value: '+142 today', trend: 'up' }}
            sparklineData={[13200, 13800, 14100, 14500, 14820]}
          />
          <StatCard
            label="Approved & Dispatched"
            value={stateStats.approvedClearances}
            delta={{ value: '94.1%', trend: 'up' }}
            sparklineData={[12400, 12900, 13200, 13600, 13950]}
          />
          <StatCard
            label="In Scrutiny Queue"
            value={stateStats.underProcess}
            delta={{ value: '-18 today', trend: 'down' }}
            sparklineData={[890, 840, 810, 760, 720]}
          />
          <StatCard
            label="Avg Clearance Time"
            value={`${stateStats.avgClearanceDays} Days`}
            delta={{ value: '-64% vs 180d', trend: 'up' }}
            sparklineData={[18.5, 17.2, 16.1, 15.4, 14.8]}
          />
          <StatCard
            label="SLA Compliance"
            value={`${stateStats.slaComplianceRate}%`}
            delta={{ value: 'Target: 95%', trend: 'up' }}
            sparklineData={[96.2, 97.1, 97.8, 98.1, 98.4]}
          />
          <StatCard
            label="SLA Breaches (24h)"
            value={stateStats.breachesLast24h}
            delta={{ value: 'L2 Escalated', trend: 'down' }}
            sparklineData={[8, 6, 5, 4, 3]}
          />
        </div>

        {/* BOTTLENECK HEATMAP (Custom Grid, No Chart Library) */}
        <div className="surface-card p-5 space-y-4 border-[var(--border-strong)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--border)] pb-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">
                State Department Bottleneck Heatmap
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Color intensity maps active SLA breaches and scrutiny congestion across Maharashtra industrial districts.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[var(--surface-2)] border border-[var(--border)]" />
                <span>Normal (&lt;30 apps)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#FFFAEB] border border-[#FEDF89]" />
                <span>Congested (&gt;30 apps)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#FEE4E2] border border-[#FECDCA]" />
                <span>SLA Breach (&ge;1)</span>
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr className="text-[var(--text-muted)] select-none">
                  <th className="text-left py-2 px-3 font-semibold w-48">District Zone</th>
                  {heatmapDepartments.map((dept) => (
                    <th key={dept.code} className="py-2 px-2 font-semibold">
                      <div>{dept.code}</div>
                      <div className="text-[10px] font-normal text-[var(--text-subtle)] truncate">
                        {dept.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {heatmapDistricts.map((district) => (
                  <tr key={district} className="hover:bg-[var(--surface-2)] transition">
                    <td className="text-left py-3 px-3 font-semibold text-[var(--text)]">
                      {district}
                    </td>
                    {heatmapDepartments.map((dept) => {
                      const data = heatmapMatrix[district]?.[dept.code] || {
                        pending: 0,
                        breached: 0,
                        avgTAT: 10,
                      };
                      const colorClass = getHeatmapColor(data.breached, data.pending);
                      return (
                        <td key={dept.code} className="py-2 px-1">
                          <button
                            type="button"
                            onClick={() => setSelectedCell({ district, dept: dept.code, ...data })}
                            className={cn(
                              'w-full py-2 px-1 rounded-lg border font-mono transition cursor-pointer select-none text-center',
                              colorClass
                            )}
                            title={`${district} - ${dept.name}: ${data.pending} pending, ${data.breached} breached, ${data.avgTAT}d avg`}
                          >
                            <div className="font-bold text-xs">{data.pending}</div>
                            {data.breached > 0 ? (
                              <div className="text-[10px] font-semibold text-[#B42318]">
                                {data.breached} Breached
                              </div>
                            ) : (
                              <div className="text-[10px] opacity-75">{data.avgTAT}d TAT</div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2-COLUMN SECTION: CHARTS + ESCALATION FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: DEPARTMENT AVERAGE TAT vs STATUTORY CAP (Col 7) */}
          <div className="lg:col-span-7 surface-card p-5 space-y-4">
            <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Department Turnaround vs Statutory SLA Cap (Days)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  All 6 key departments consistently operating well below the maximum statutory window.
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={deptTurnaroundData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="dept"
                      stroke="var(--text-subtle)"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis stroke="var(--text-subtle)" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="surface-card p-2.5 shadow-[var(--shadow-lg)] border-[var(--border)] text-xs space-y-1">
                              <div className="font-semibold text-[var(--text)]">{item.dept}</div>
                              <div className="text-[var(--primary-600)]">
                                Average Clearance: {item.avgDays} Days
                              </div>
                              <div className="text-[var(--text-subtle)]">
                                Statutory Cap: {item.statutoryCap} Days
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="avgDays" fill="#2A47C9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* RIGHT: REAL-TIME ESCALATION REGISTER (Col 5) */}
          <div className="lg:col-span-5 surface-card p-5 space-y-4">
            <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">
                  Statutory Escalation Register (L1 - L4)
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Auto-escalated to Higher Authorities under RTS Section 8.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'ESC-0098',
                  unit: 'Deccan Bio-Pharma',
                  dept: 'Fire Services Pune',
                  level: 'L3 Principal Secy',
                  delayDays: 4,
                  reason: 'Underground static tank calculation inquiry pending',
                },
                {
                  id: 'ESC-0095',
                  unit: 'Sahyadri Precision',
                  dept: 'DISH Bhosari',
                  level: 'L2 Director Safety',
                  delayDays: 2,
                  reason: 'Machine gangway dimension objection pending review',
                },
                {
                  id: 'ESC-0091',
                  unit: 'Maha Solar Grid Parks',
                  dept: 'Revenue Dept Haveli',
                  level: 'L1 District Collector',
                  delayDays: 1,
                  reason: 'NA conversion boundary measurement file in transit',
                },
              ].map((esc) => (
                <CardSpotlight
                  key={esc.id}
                  spotlightColor="rgba(180, 35, 24, 0.08)"
                  className="p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[var(--text)]">{esc.id}</span>
                    <span className="font-mono text-[10px] font-bold text-[#B42318] bg-[#FEE4E2] px-2 py-0.5 rounded-full border border-[#FECDCA]">
                      {esc.level}
                    </span>
                  </div>
                  <div className="font-medium text-[var(--text)]">{esc.unit}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {esc.dept} · Delayed by {esc.delayDays}d
                  </div>
                  <p className="text-[11px] text-[var(--text-subtle)] italic">
                    &ldquo;{esc.reason}&rdquo;
                  </p>
                </CardSpotlight>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* HEATMAP DRILL-DOWN SHEET */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex justify-end overlay-backdrop animate-in fade-in-50 duration-150">
          <div
            className="w-full max-w-md h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-[var(--shadow-xl)] p-6 space-y-5 flex flex-col animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  {selectedCell.district} · {selectedCell.dept}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  District departmental scrutiny breakdown
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="text-lg font-bold font-mono text-[var(--text)]">
                  {selectedCell.pending}
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">Pending</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="text-lg font-bold font-mono text-[#B42318]">
                  {selectedCell.breached}
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">Breached</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="text-lg font-bold font-mono text-[var(--primary-600)]">
                  {selectedCell.avgTAT}d
                </div>
                <div className="text-[10px] text-[var(--text-muted)]">Avg TAT</div>
              </div>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
              <div className="text-xs font-semibold text-[var(--text)]">Priority Applications:</div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] space-y-1 text-xs">
                <div className="font-semibold text-[var(--text)]">APP-2026-0048</div>
                <div className="text-[var(--text-muted)]">Deccan Bio-Pharma Formulations</div>
                <div className="text-[11px] text-[#B42318] font-medium">SLA Breached · Auto-Flagged</div>
              </div>
              <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] space-y-1 text-xs">
                <div className="font-semibold text-[var(--text)]">APP-2026-0042</div>
                <div className="text-[var(--text-muted)]">Rahul Foods & Dairy Agro Ltd</div>
                <div className="text-[11px] text-[#12B76A] font-medium">On Track · 18d Remaining</div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setSelectedCell(null)}
            >
              Close Drill-Down
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
