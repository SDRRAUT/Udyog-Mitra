'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  Building2,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Activity,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PublicTransparencyPage() {
  const [districtSearch, setDistrictSearch] = useState('');

  const departmentLeaderboard = [
    { rank: 1, name: 'MIDC (Land & Utilities)', code: 'MIDC', avgDays: 7.2, slaRate: 99.2, totalCleared: 3410, rating: 'EXEMPLARY' },
    { rank: 2, name: 'Labour Welfare Board', code: 'LABOUR', avgDays: 6.8, slaRate: 99.5, totalCleared: 2890, rating: 'EXEMPLARY' },
    { rank: 3, name: 'Maharashtra Fire Services', code: 'FIRE', avgDays: 11.8, slaRate: 98.1, totalCleared: 2420, rating: 'HIGH SPEED' },
    { rank: 4, name: 'MPCB (Pollution Control)', code: 'MPCB', avgDays: 14.5, slaRate: 97.8, totalCleared: 3850, rating: 'ON TRACK' },
    { rank: 5, name: 'DISH (Industrial Safety)', code: 'DISH', avgDays: 16.1, slaRate: 96.4, totalCleared: 2380, rating: 'ON TRACK' },
  ];

  const allDistricts = [
    { rank: 1, name: 'Pune', division: 'Pune', avgDays: 12.4, slaRate: 99.1, activeQueue: 480, maitriScore: 98 },
    { rank: 2, name: 'Thane', division: 'Konkan', avgDays: 13.8, slaRate: 98.5, activeQueue: 390, maitriScore: 96 },
    { rank: 3, name: 'Chhatrapati Sambhajinagar', division: 'Marathwada', avgDays: 15.2, slaRate: 97.2, activeQueue: 240, maitriScore: 94 },
    { rank: 4, name: 'Nashik', division: 'Nashik', avgDays: 16.1, slaRate: 96.8, activeQueue: 180, maitriScore: 92 },
    { rank: 5, name: 'Nagpur', division: 'Vidarbha', avgDays: 16.9, slaRate: 96.1, activeQueue: 165, maitriScore: 90 },
    { rank: 6, name: 'Kolhapur', division: 'Pune', avgDays: 18.2, slaRate: 95.4, activeQueue: 110, maitriScore: 88 },
    { rank: 7, name: 'Raigad', division: 'Konkan', avgDays: 14.6, slaRate: 97.9, activeQueue: 210, maitriScore: 93 },
    { rank: 8, name: 'Solapur', division: 'Pune', avgDays: 17.5, slaRate: 95.8, activeQueue: 95, maitriScore: 89 },
    { rank: 9, name: 'Amravati', division: 'Vidarbha', avgDays: 18.9, slaRate: 94.7, activeQueue: 75, maitriScore: 86 },
    { rank: 10, name: 'Nanded', division: 'Marathwada', avgDays: 19.3, slaRate: 94.1, activeQueue: 60, maitriScore: 85 },
  ];

  const filteredDistricts = allDistricts.filter(
    (d) =>
      d.name.toLowerCase().includes(districtSearch.toLowerCase()) ||
      d.division.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const handleDownloadOpenData = () => {
    const data = {
      portal: 'UDYOG MITRA | Government of Maharashtra',
      statutoryAct: 'Maharashtra Right to Public Services Act 2015',
      generatedAt: new Date().toISOString(),
      statewideMetrics: {
        totalApplications: 14820,
        approvedClearances: 13950,
        averageTurnaroundDays: 14.8,
        statutorySlaComplianceRate: 98.4,
        deemedApprovalsExercised: 42,
      },
      departmentLeaderboard,
      districtIndex: allDistricts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maharashtra_Industrial_Clearances_OpenData_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-[var(--primary-100)] selection:text-[var(--primary-900)]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 min-w-0">
        {/* Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-xs font-semibold text-[var(--text)]">
            <Activity className="w-3.5 h-3.5 text-[#12B76A] animate-pulse" />
            <span>Open Government Public Disclosure | Maharashtra RTS Act 2015</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
            Industrial Clearance Transparency & Speed Index
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Real-time public performance disclosures, statutory Right to Service compliance metrics, and district ease of doing business velocity benchmarks.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <Button
              onClick={handleDownloadOpenData}
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5 text-[var(--primary-600)]" />}
            >
              Export Open Data (JSON)
            </Button>
            <Link href="/track">
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Track Specific Unit
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-xl surface-card border border-[var(--border)] shadow-xs">
            <div className="text-xs text-[var(--text-subtle)]">Total Clearances Processed</div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--text)] mt-1 font-mono">14,820</div>
            <div className="text-[11px] text-[#12B76A] mt-1 flex items-center font-medium">
              <TrendingUp className="w-3 h-3 mr-1" /> 94.1% Approved
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl surface-card border border-[var(--border)] shadow-xs">
            <div className="text-xs text-[var(--text-subtle)]">State Avg Turnaround</div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--primary-600)] mt-1 font-mono">14.8 Days</div>
            <div className="text-[11px] text-[var(--text-subtle)] mt-1">
              Statutory RTS Cap: 30 days
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl surface-card border border-[var(--border)] shadow-xs">
            <div className="text-xs text-[var(--text-subtle)]">Statutory SLA Compliance</div>
            <div className="text-2xl sm:text-3xl font-bold text-[#12B76A] mt-1 font-mono">98.4%</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Zero arbitrary pendency</div>
          </div>

          <div className="p-4 sm:p-5 rounded-xl surface-card border border-[var(--border)] shadow-xs">
            <div className="text-xs text-[var(--text-subtle)]">Deemed Clearances Granted</div>
            <div className="text-2xl sm:text-3xl font-bold text-[var(--accent-500)] mt-1 font-mono">42</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">Automated statutory deeming</div>
          </div>
        </div>

        {/* Department Speed Leaderboard */}
        <div className="surface-card border border-[var(--border)] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[var(--border)] pb-4">
            <div>
              <div className="text-xs font-semibold text-[var(--primary-600)] uppercase tracking-wider">
                Statutory Clearance Speed Leaderboard
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">Department Turnaround Velocity & Adherence</h2>
            </div>
            <span className="text-xs text-[var(--text-subtle)]">Ranked by lowest average processing days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {departmentLeaderboard.map((dept) => (
              <div
                key={dept.code}
                className="p-3.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <span className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--primary-700)] text-xs font-mono font-bold flex items-center justify-center">
                    #{dept.rank}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[var(--success-text)] bg-[var(--success-bg)] px-1.5 py-0.5 rounded border border-[#A6F4C5]">
                    {dept.slaRate}% SLA
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-xs text-[var(--text)] truncate">{dept.name}</h3>
                  <div className="text-xl font-bold text-[var(--text)] mt-1 font-mono">{dept.avgDays} <span className="text-xs font-normal text-[var(--text-subtle)]">Days</span></div>
                </div>

                <div className="text-[11px] text-[var(--text-subtle)] pt-2 border-t border-[var(--border)] flex justify-between">
                  <span>Cleared:</span>
                  <span className="font-mono font-medium text-[var(--text)]">{dept.totalCleared}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 36-District Clearance Velocity Index */}
        <div className="surface-card border border-[var(--border)] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--border)] pb-4">
            <div>
              <div className="text-xs font-semibold text-[var(--primary-600)] uppercase tracking-wider">
                District Ease of Doing Business
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text)]">Maharashtra Industrial Clearance Velocity Index</h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--text-subtle)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                placeholder="Filter district or division..."
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-subtle)] font-medium bg-[var(--surface-2)]">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Division</th>
                  <th className="py-2.5 px-3">Avg TAT</th>
                  <th className="py-2.5 px-3">SLA Compliance</th>
                  <th className="py-2.5 px-3">Active Pipeline</th>
                  <th className="py-2.5 px-3">Velocity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text)]">
                {filteredDistricts.map((d) => (
                  <tr key={d.name} className="hover:bg-[var(--surface-2)] transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--primary-700)]">#{d.rank}</td>
                    <td className="py-2.5 px-3 font-semibold">{d.name}</td>
                    <td className="py-2.5 px-3 text-[var(--text-muted)]">{d.division}</td>
                    <td className="py-2.5 px-3 font-mono">{d.avgDays}d</td>
                    <td className="py-2.5 px-3 font-mono text-[#12B76A]">{d.slaRate}%</td>
                    <td className="py-2.5 px-3 font-mono">{d.activeQueue}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-200)]">
                        {d.maitriScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
