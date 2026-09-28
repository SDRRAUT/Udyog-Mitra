'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import StatusBadge from '@/components/StatusBadge';
import {
  ShieldAlert,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function DepartmentHODDashboard() {
  const [selectedDept, setSelectedDept] = useState('MPCB');

  const officerWorkload = [
    { name: 'Dr. S. Kulkarni', role: 'Regional Officer (Env)', activeLoad: 14, atRisk: 2, breached: 1, avgDays: 13.2, score: 96 },
    { name: 'P. Gokhale', role: 'Sub-Regional Officer (Air)', activeLoad: 11, atRisk: 1, breached: 0, avgDays: 12.8, score: 98 },
    { name: 'M. Shinde', role: 'Field Inspector (Water)', activeLoad: 16, atRisk: 3, breached: 1, avgDays: 15.4, score: 92 },
    { name: 'R. Kadam', role: 'Scientific Officer', activeLoad: 9, atRisk: 0, breached: 0, avgDays: 11.5, score: 99 },
  ];

  const escalatedClearances = [
    {
      id: 'appr-esc-1',
      appNo: 'MH-2025-PUN-00098',
      businessName: 'Shree Chemical Industries Pvt Ltd',
      approval: 'Consent to Establish (CTE) - Red Category',
      assignedOfficer: 'Dr. S. Kulkarni',
      slaDueAt: '2026-09-26T14:00:00Z',
      overdueHours: 26,
      escalationLevel: 'L2_HOD',
      delayReason: 'Delay in hazardous waste containment verification report.',
    },
    {
      id: 'appr-esc-2',
      appNo: 'MH-2025-PUN-00145',
      businessName: 'Apex Precision Metallurgy Ltd',
      approval: 'Consent to Establish (CTE) - Orange Category',
      assignedOfficer: 'M. Shinde',
      slaDueAt: '2026-09-27T08:00:00Z',
      overdueHours: 8,
      escalationLevel: 'L2_HOD',
      delayReason: 'Pending chimney stack height calculation clarification.',
    },
  ];

  const handleReassign = (appId: string, officerName: string) => {
    alert(`Clearance #${appId} re-assigned to ${officerName} with priority expedited directive.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Department HOD & Workload Console • Maharashtra Setu</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              MPCB Head of Department (HOD) Oversight
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor officer capacity, resolve L2 statutory escalations, and prevent RTS Act penalties.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/officer"
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-slate-950 text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Open Scrutiny Queue
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Active Queue Inflow</div>
            <div className="text-2xl font-black text-white mt-1">50 Units</div>
            <div className="text-[11px] text-emerald-400 mt-1">Allocated across 4 officers</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">L2 Escalations (Breached)</div>
            <div className="text-2xl font-black text-rose-400 mt-1">2 Units</div>
            <div className="text-[11px] text-rose-300 mt-1">Requires immediate HOD intervention</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Avg Department TAT</div>
            <div className="text-2xl font-black text-amber-400 mt-1">13.2 Days</div>
            <div className="text-[11px] text-emerald-400 mt-1">56% faster than 30d SLA cap</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">30-Day SLA Adherence</div>
            <div className="text-2xl font-black text-cyan-400 mt-1">97.8%</div>
            <div className="text-[11px] text-slate-400 mt-1">Right to Public Services Benchmark</div>
          </div>
        </div>

        {/* L2 STATUTORY ESCALATION OVERWATCH */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-base text-white">L2 Statutory Escalations (Action Required by HOD)</h3>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
              Escalates to DIC General Manager in 24h
            </span>
          </div>

          <div className="space-y-3">
            {escalatedClearances.map((esc) => (
              <div
                key={esc.id}
                className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-rose-400">{esc.appNo}</span>
                      <span className="font-bold text-white text-sm">{esc.businessName}</span>
                    </div>
                    <div className="text-slate-400">{esc.approval} • Assigned Officer: <span className="text-slate-200 font-semibold">{esc.assignedOfficer}</span></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400 font-bold font-mono">
                      +{esc.overdueHours}h Overdue
                    </span>
                    <button
                      onClick={() => handleReassign(esc.appNo, 'P. Gokhale')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                    >
                      Reassign File
                    </button>
                    <button
                      onClick={() => alert(`Statutory 5-day extension granted for #${esc.appNo} with formal justification.`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                    >
                      Grant Extension
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-amber-400">Delay Reason Logged:</span> {esc.delayReason}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OFFICER WORKLOAD & CAPACITY MATRIX */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-base text-white">Department Officer Workload & Processing Speed Matrix</h3>
            </div>
            <span className="text-xs text-slate-400">Real-time load balancing</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Scrutiny Officer</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Active Pending Load</th>
                  <th className="p-3">At Risk (&lt;24h)</th>
                  <th className="p-3">Breached SLA</th>
                  <th className="p-3">Avg Turnaround</th>
                  <th className="p-3 text-right">SLA Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {officerWorkload.map((off, idx) => (
                  <tr key={idx} className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span>{off.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{off.role}</td>
                    <td className="p-3 font-mono font-bold text-slate-200">{off.activeLoad} files</td>
                    <td className="p-3 font-mono font-bold text-amber-400">{off.atRisk}</td>
                    <td className="p-3 font-mono font-bold text-rose-400">{off.breached}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{off.avgDays} Days</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {off.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
