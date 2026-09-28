'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  Layers,
  Plus,
  Edit2,
  Clock,
  FileText,
  Shield,
  Search,
  ArrowRight,
  CheckCircle2,
  Zap,
  Lock
} from 'lucide-react';

export default function AdminApprovalsMasterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [approvals, setApprovals] = useState([
    {
      code: 'MPCB_CTE',
      name: 'Consent to Establish (CTE)',
      department: 'MPCB',
      stage: 'STAGE_1_PRE_ESTABLISHMENT',
      slaDays: 30,
      parallelEligible: true,
      dependencies: [],
      feesFormula: 'Capital Investment Bracket (Scale ₹5,000 - ₹5,00,000)',
      requiredDocs: ['Site Plan with scaled layout', 'Project Report with Process Flow', 'Effluent Treatment Plant (ETP) Proposal'],
      statutoryAct: 'Water Act 1974 §25 & Air Act 1981 §21'
    },
    {
      code: 'DISH_FACTORY_PLAN',
      name: 'Factory Building Plan Approval',
      department: 'DISH',
      stage: 'STAGE_1_PRE_ESTABLISHMENT',
      slaDays: 30,
      parallelEligible: true,
      dependencies: [],
      feesFormula: 'Based on HP & Manpower',
      requiredDocs: ['Architectural Elevation Drawing', 'Plant Machinery Layout', 'Ventilation & Emergency Exit Plan'],
      statutoryAct: 'Factories Act 1948 & Maharashtra Factories Rules 1963'
    },
    {
      code: 'MIDC_BUILDING_PLAN',
      name: 'MIDC Industrial Building Plan Sanction',
      department: 'MIDC',
      stage: 'STAGE_1_PRE_ESTABLISHMENT',
      slaDays: 30,
      parallelEligible: true,
      dependencies: [],
      feesFormula: 'Development charges per sq.m',
      requiredDocs: ['MIDC Allotment Letter', 'Possession Receipt', 'Structural Engineer Stability Certificate'],
      statutoryAct: 'MIDC Act 1961 §14'
    },
    {
      code: 'FIRE_PROVISIONAL_NOC',
      name: 'Provisional Fire Safety NOC',
      department: 'FIRE',
      stage: 'STAGE_1_PRE_ESTABLISHMENT',
      slaDays: 15,
      parallelEligible: false,
      dependencies: ['MIDC_BUILDING_PLAN'],
      feesFormula: 'Scrutiny fee based on building height & area',
      requiredDocs: ['Fire Fighting Hydraulic Flow Calculations', 'Hydrant & Sprinkler Layout Plan'],
      statutoryAct: 'Maharashtra Fire Prevention & Life Safety Act 2006'
    },
    {
      code: 'MPCB_CTO',
      name: 'Consent to Operate (CTO)',
      department: 'MPCB',
      stage: 'STAGE_2_PRE_OPERATION',
      slaDays: 30,
      parallelEligible: true,
      dependencies: ['MPCB_CTE'],
      feesFormula: 'Annual capital basis',
      requiredDocs: ['CTE Compliance Report', 'Adequacy Certificate of Pollution Control Systems', 'Environmental Audit Report'],
      statutoryAct: 'Water Act 1974 & Air Act 1981'
    },
    {
      code: 'DISH_FACTORY_LICENSE',
      name: 'Factory License (Registration & Grant)',
      department: 'DISH',
      stage: 'STAGE_2_PRE_OPERATION',
      slaDays: 30,
      parallelEligible: true,
      dependencies: ['DISH_FACTORY_PLAN'],
      feesFormula: 'Power KW & Employee headcount matrix',
      requiredDocs: ['Completion Notice Form 2', 'Stability Certificate Form 1-A', 'Safety Officer Appointment'],
      statutoryAct: 'Factories Act 1948 Section 6'
    }
  ]);

  const filteredApprovals = approvals.filter(
    a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.code.toLowerCase().includes(searchTerm.toLowerCase()) || a.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Statutory Approval Master Registry
                </h1>
                <p className="text-sm text-slate-400">
                  Configure clearances, RTS SLA timelines, document templates, and parallel dependency graphs
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('New Approval Master Definition Dialog')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Register New Clearance
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by clearance name, department, statutory Act..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Approvals Table / Cards */}
        <div className="mt-6 space-y-4">
          {filteredApprovals.map(app => (
            <div
              key={app.code}
              className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      {app.code}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded">
                      {app.department}
                    </span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs text-slate-400">{app.statutoryAct}</span>
                    {app.parallelEligible && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Zap className="w-3 h-3" />
                        Parallel Scrutiny
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mt-1.5">{app.name}</h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    SLA: {app.slaDays} Days
                  </div>

                  <button
                    onClick={() => alert(`Edit Approval Configuration for ${app.code}`)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Requirements & Dependencies */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Mandatory Documents Required</span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.requiredDocs.map((doc, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800">
                        📄 {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Dependencies</span>
                  {app.dependencies.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-300">
                        Requires approval of: {app.dependencies.join(', ')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-emerald-400">Independent (Can be initiated in Stage 1 parallel routing)</span>
                  )}
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
