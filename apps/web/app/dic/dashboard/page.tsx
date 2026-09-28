'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import StatusBadge from '@/components/StatusBadge';
import {
  Building2,
  ShieldAlert,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Compass,
  PhoneCall,
  Edit,
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function DICDashboardPage() {
  const [assistedModalOpen, setAssistedModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  const districtStats = {
    district: 'Pune',
    totalApplications: 312,
    inProgress: 140,
    breached: 9,
    l3Escalations: 3,
    avgTATDays: 12.4,
    slaCompliance: 99.1,
  };

  const l3Escalations = [
    {
      appNo: 'MH-2025-PUN-00098',
      unitName: 'Shree Chemical Industries Pvt Ltd',
      department: 'DISH',
      overdueHours: 52,
      assignedHOD: 'A. Deshmukh',
      issue: 'Delay in Factory Plan chemical safety clearance beyond 30 days statutory cap.',
    },
    {
      appNo: 'MH-2025-PUN-00164',
      unitName: 'Sahyadri Agro Processing Hub',
      department: 'MPCB',
      overdueHours: 34,
      assignedHOD: 'Dr. S. Kulkarni',
      issue: 'Effluent discharge pipeline sanction delayed at regional office.',
    },
  ];

  const handholdingQueue = [
    {
      id: 'draft-1',
      unitName: 'Rahul Foods & Spices',
      promoter: 'Rahul Jadhav',
      mobile: '+91 98230 11223',
      readiness: 45,
      stuckDays: 8,
      missingItem: 'Site Master Plan & ETP Specifications',
    },
    {
      id: 'draft-2',
      unitName: 'Maratha Bio-Fertilizers',
      promoter: 'Sunil Shinde',
      mobile: '+91 98221 44556',
      readiness: 38,
      stuckDays: 11,
      missingItem: 'Gram Panchayat NOC & Land 7/12 Extract',
    },
  ];

  const handleStartAssistedMode = (unit: any) => {
    setSelectedUnit(unit);
    setAssistedModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-950 border border-orange-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-orange-400" />
              <span>District Industries Centre (DIC) Pune • General Manager Console</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              District Industrial Ease of Doing Business & L3 Escalations
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Empowered district coordination under Maharashtra Industrial Policy 2019 & RTS Act 2015.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 px-3 py-1.5 rounded-xl">
              Rank #1 in Maharashtra
            </span>
          </div>
        </div>

        {/* District Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">District Total Inflow</div>
            <div className="text-2xl font-black text-white mt-1">{districtStats.totalApplications}</div>
            <div className="text-[11px] text-slate-400 mt-1">{districtStats.inProgress} active scrutiny</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">L3 Escalations (DIC GM Level)</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{districtStats.l3Escalations} Units</div>
            <div className="text-[11px] text-rose-300 mt-1">Breached &gt;48h at department level</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">District Avg TAT</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{districtStats.avgTATDays} Days</div>
            <div className="text-[11px] text-emerald-400 mt-1">Best clearance speed in Maharashtra</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">SLA Compliance Rate</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{districtStats.slaCompliance}%</div>
            <div className="text-[11px] text-emerald-300 mt-1">Statutory Benchmark</div>
          </div>
        </div>

        {/* 2-COLUMN: L3 ESCALATIONS & HANDHOLDING QUEUE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: L3 STATUTORY ESCALATION OVERWATCH (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-base text-white">L3 Statutory Escalations (Overdue Across Departments)</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">DIC GM Appellate Tier</span>
            </div>

            <div className="space-y-3">
              {l3Escalations.map((esc, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-rose-400">{esc.appNo}</span>
                        <span className="font-bold text-white">{esc.unitName}</span>
                      </div>
                      <div className="text-slate-400">Department: <span className="font-semibold text-slate-200">{esc.department}</span> • Assigned HOD: {esc.assignedHOD}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold font-mono">
                        +{esc.overdueHours}h
                      </span>
                      <button
                        onClick={() => alert(`Direct summons notice dispatched to ${esc.assignedHOD} (${esc.department}) for immediate resolution within 12h.`)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                      >
                        Summon HOD
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-slate-850">
                    {esc.issue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: HANDHOLDING QUEUE & ASSISTED MODE (Col 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-base text-white">Entrepreneur Handholding Queue</h3>
              </div>
              <span className="text-[10px] text-amber-400">Stuck in Draft &gt;7 Days</span>
            </div>

            <p className="text-xs text-slate-400">
              Entrepreneurs experiencing low digital readiness or documentation hurdles. Use DIC Assisted Mode to co-fill CAF with official consent.
            </p>

            <div className="space-y-3">
              {handholdingQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.unitName}</h4>
                      <div className="text-slate-400 text-[11px]">{item.promoter} • {item.mobile}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-amber-400 bg-amber-500/10 text-[10px]">
                      {item.readiness}% Readiness
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Bottleneck:</span>
                    <span>{item.missingItem} (Stuck {item.stuckDays} days)</span>
                  </div>

                  <div className="flex justify-end space-x-2 pt-1">
                    <a
                      href={`tel:${item.mobile}`}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-400" />
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => handleStartAssistedMode(item)}
                      className="px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Assisted Mode</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Assisted Mode Modal */}
      {assistedModalOpen && selectedUnit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-orange-400">DIC Citizen Assistance</span>
                <h3 className="text-base font-black text-white">Activate Assisted Mode Filing</h3>
                <div className="text-xs text-slate-400">{selectedUnit.unitName} ({selectedUnit.promoter})</div>
              </div>
              <button onClick={() => setAssistedModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                Under Section 5 of Maharashtra RTS Act 2015, District Industries Centre officers are statutorily empowered to complete Common Application Forms on behalf of rural or first-generation entrepreneurs with their informed verbal/written consent.
              </p>

              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[11px]">
                Audit Trail Notice: Every field entered will be digitally signed and recorded as: <br />
                <span className="font-mono font-bold">"Assisted & Transmitted by GM DIC Pune on behalf of {selectedUnit.promoter}"</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
              <button
                onClick={() => setAssistedModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <Link
                href="/applications/new"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-slate-950 flex items-center space-x-1"
              >
                <span>Proceed to Assisted CAF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <AIChatWidget />
    </div>
  );
}
