'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  Gift,
  Plus,
  Edit2,
  CheckCircle2,
  Percent,
  IndianRupee,
  Layers,
  FileCheck2,
  Filter,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function AdminSchemesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<any>(null);

  const [schemes, setSchemes] = useState([
    {
      id: 'SCH-PSI-2019',
      name: 'Package Scheme of Incentives (PSI 2019) – Industrial Promotion Subsidy',
      department: 'Directorate of Industries, Maharashtra',
      category: 'Capital & Promotion Subsidy',
      maxBenefit: 'Up to 100% of Fixed Capital Investment (FCI)',
      eligibility: 'Micro, Small, Medium, Large & Mega Units in Zones B, C, D, D+ and No-Industry Districts',
      activeApplications: 840,
      disbursedAmount: '₹ 142.50 Cr',
      status: 'ACTIVE'
    },
    {
      id: 'SCH-ELEC-DUTY',
      name: '100% Electricity Duty Exemption Scheme',
      department: 'Energy Department & Industries Dept',
      category: 'Operational Cost Relief',
      maxBenefit: '100% exemption for 7 to 10 years based on taluka categorization',
      eligibility: 'Manufacturing units registered with Udyam; all MSME categories',
      activeApplications: 620,
      disbursedAmount: '₹ 38.20 Cr',
      status: 'ACTIVE'
    },
    {
      id: 'SCH-STAMP-DUTY',
      name: '100% Stamp Duty & Registration Fee Exemption',
      department: 'Revenue & Forest Department, Maharashtra',
      category: 'Land & Acquisition Relief',
      maxBenefit: '100% waiver of Stamp Duty on land purchase/lease deeds in industrial areas',
      eligibility: 'New units in MIDC or designated industrial estates acquiring land/sheds',
      activeApplications: 512,
      disbursedAmount: '₹ 22.80 Cr',
      status: 'ACTIVE'
    },
    {
      id: 'SCH-PMFME-MH',
      name: 'PM Formalisation of Micro Food Processing Enterprises (PMFME Maharashtra)',
      department: 'Maharashtra State Agriculture Marketing Board & Industries',
      category: 'Food Processing Specific',
      maxBenefit: 'Credit-linked capital subsidy @ 35% of eligible project cost (max ₹10 Lakh)',
      eligibility: 'Individual food micro-enterprises and SHGs in agro-processing sectors',
      activeApplications: 280,
      disbursedAmount: '₹ 18.40 Cr',
      status: 'ACTIVE'
    }
  ]);

  const filteredSchemes = schemes.filter(
    s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Government Schemes & Incentive Master
                </h1>
                <p className="text-sm text-slate-400">
                  Configure statutory subsidies, eligibility algorithms (JSONLogic) and monitor disbursement
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('New Scheme Definition modal - Add Rule & GR Reference')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Configure New Scheme
            </button>
          </div>
        </div>

        {/* Search & Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">Active Schemes</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">14 Schemes</div>
            <span className="text-[11px] text-emerald-400">100% GR Grounded</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">Eligible Matched Units</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">2,252 Units</div>
            <span className="text-[11px] text-slate-400">Via Automated Rule Matching</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">Applications Received</span>
            <div className="text-2xl font-bold text-blue-400 font-mono mt-1">1,480 Units</div>
            <span className="text-[11px] text-slate-400">CAF Pre-filled Submissions</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <span className="text-xs text-slate-400">Total Sanctioned Value</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">₹ 221.9 Cr</div>
            <span className="text-[11px] text-emerald-400 font-medium">State Budget Allocation</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scheme name, department or code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Scheme List */}
        <div className="mt-6 space-y-4">
          {filteredSchemes.map(s => (
            <div
              key={s.id}
              className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {s.id}
                    </span>
                    <span className="text-xs text-slate-400">| {s.department}</span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 rounded">
                      {s.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{s.name}</h3>
                  <p className="text-xs text-slate-400 max-w-3xl">
                    <strong className="text-slate-300">Eligibility:</strong> {s.eligibility}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => alert(`Edit Scheme Rule Configuration for ${s.id}`)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Maximum Benefit</span>
                  <span className="font-medium text-slate-200">{s.maxBenefit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Active Applications</span>
                  <span className="font-mono font-medium text-blue-400">{s.activeApplications} Units Applied</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Disbursed Subsidies</span>
                  <span className="font-mono font-bold text-emerald-400">{s.disbursedAmount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
