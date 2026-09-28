'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  TrendingDown,
  TrendingUp,
  Building2,
  Users
} from 'lucide-react';

export default function DepartmentReportsPage() {
  const [selectedDept, setSelectedDept] = useState('MPCB');
  const [timeRange, setTimeRange] = useState('LAST_30_DAYS');

  const reportMetrics = {
    totalApplications: 418,
    clearedWithinSla: 402,
    breachedSla: 16,
    complianceRate: '96.2%',
    avgTatDays: '14.2 Days',
    statutoryTargetDays: '30 Days',
    jointInspectionsConducted: 48,
    activePending: 64
  };

  const officerRankings = [
    { name: 'Dr. Suresh Deshmukh', role: 'Sub-Regional Officer (SRO-I)', cleared: 112, avgTat: '11.8 Days', slaRate: '98.2%', pending: 14 },
    { name: 'Pooja Kulkarni', role: 'Field Officer (Pimpri)', cleared: 98, avgTat: '13.1 Days', slaRate: '96.9%', pending: 18 },
    { name: 'Anil Shinde', role: 'Junior Environmental Eng.', cleared: 84, avgTat: '15.4 Days', slaRate: '95.2%', pending: 16 },
    { name: 'Vikram Joshi', role: 'Scientific Officer', cleared: 108, avgTat: '14.0 Days', slaRate: '97.3%', pending: 16 },
  ];

  const handleExport = (format: 'PDF' | 'CSV') => {
    alert(`Generating official ${format} statutory report for ${selectedDept} (${timeRange}). Download will start shortly.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Department Statutory Performance & TAT Reports
                </h1>
                <p className="text-sm text-slate-400">
                  Turnaround times (TAT), Right to Services (RTS) compliance, and officer workload audit
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport('CSV')}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-sm transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-blue-500/20"
            >
              <FileText className="w-4 h-4" />
              Generate Official PDF
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" />
              Department:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {['MPCB', 'DISH', 'FIRE', 'MIDC', 'LABOUR'].map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded transition ${
                    selectedDept === dept ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              Period:
            </span>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days (Current Month)</option>
              <option value="LAST_QUARTER">Q3 FY 2025-26</option>
              <option value="FULL_YEAR">FY 2025-26 (Year to Date)</option>
            </select>
          </div>
        </div>

        {/* Key KPI Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>RTS SLA Compliance</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white font-mono">{reportMetrics.complianceRate}</div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              +1.8% vs statutory minimum (90%)
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Average Turnaround (TAT)</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white font-mono">{reportMetrics.avgTatDays}</div>
            <div className="text-[11px] text-blue-400 mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              52% faster than 30d statutory cap
            </div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Cleared Applications</span>
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white font-mono">{reportMetrics.clearedWithinSla}</div>
            <div className="text-[11px] text-slate-400 mt-1">Out of {reportMetrics.totalApplications} total received</div>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Statutory Breaches</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-400 font-mono">{reportMetrics.breachedSla}</div>
            <div className="text-[11px] text-rose-400/80 mt-1">Subject to Section 18 RTS scrutiny</div>
          </div>
        </div>

        {/* Officer Workload & Scrutiny Performance */}
        <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Officer-Wise Scrutiny Audit & Workload Index
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluation of clearance speed, active load, and statutory compliance percentage
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Officer Name & Designation</th>
                  <th className="pb-3 font-semibold">Cleared (30d)</th>
                  <th className="pb-3 font-semibold">Average TAT</th>
                  <th className="pb-3 font-semibold">SLA Compliance</th>
                  <th className="pb-3 font-semibold">Active Workload</th>
                  <th className="pb-3 font-semibold text-right">Performance Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {officerRankings.map((off, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-200">{off.name}</div>
                      <div className="text-[11px] text-slate-500">{off.role}</div>
                    </td>
                    <td className="py-3.5 font-mono text-slate-300 font-semibold">{off.cleared}</td>
                    <td className="py-3.5 font-mono text-blue-400 font-medium">{off.avgTat}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-medium">{off.slaRate}</td>
                    <td className="py-3.5">
                      <span className="font-mono text-slate-200">{off.pending} active files</span>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        EXCELLENT (A+)
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
