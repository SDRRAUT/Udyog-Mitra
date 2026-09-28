'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  MapPin,
  Search,
  ExternalLink
} from 'lucide-react';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([
    {
      id: 'MPCB',
      name: 'Maharashtra Pollution Control Board',
      hod: 'Dr. V. M. Motghare (Joint Director - Air & Water)',
      mandate: 'Environmental clearances (CTE / CTO / Renewal) under Water & Air Acts',
      activeOfficers: 142,
      activeOffices: '36 District Sub-Regional Offices',
      avgTat: '14.5 Days',
      slaCompliance: '97.8%',
      status: 'ACTIVE'
    },
    {
      id: 'DISH',
      name: 'Directorate of Industrial Safety & Health',
      hod: 'Shri. M. R. Patil (Director - Industrial Safety)',
      mandate: 'Factory plan sanctions, licenses, and safety compliance under Factories Act 1948',
      activeOfficers: 98,
      activeOffices: '28 Divisional & District Circles',
      avgTat: '16.1 Days',
      slaCompliance: '96.4%',
      status: 'ACTIVE'
    },
    {
      id: 'FIRE',
      name: 'Directorate of Maharashtra Fire Services',
      hod: 'Shri. Santosh Warick (Chief Fire Officer / Director)',
      mandate: 'Provisional & Final Fire NOCs under Life Safety Act 2006',
      activeOfficers: 84,
      activeOffices: 'All Municipal & MIDC Fire Stations',
      avgTat: '11.8 Days',
      slaCompliance: '98.1%',
      status: 'ACTIVE'
    },
    {
      id: 'MIDC',
      name: 'Maharashtra Industrial Development Corporation',
      hod: 'Dr. P. Anbalagan, IAS (Chief Executive Officer)',
      mandate: 'Industrial plot allotments, building plan sanctions, water & infrastructure',
      activeOfficers: 110,
      activeOffices: '16 Regional Offices across Maharashtra',
      avgTat: '7.2 Days',
      slaCompliance: '99.2%',
      status: 'ACTIVE'
    },
    {
      id: 'LABOUR',
      name: 'Office of the Labour Commissioner, Maharashtra',
      hod: 'Shri. H. P. Tummod, IAS (Labour Commissioner)',
      mandate: 'Shops & Establishment, CLRA Contractor registrations, BOCW compliance',
      activeOfficers: 76,
      activeOffices: '36 District Labour Offices',
      avgTat: '6.8 Days',
      slaCompliance: '99.5%',
      status: 'ACTIVE'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Department & Statutory Body Registry
                </h1>
                <p className="text-sm text-slate-400">
                  Manage clearance-issuing departments, HOD escalation delegates, and field officer quotas
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Add New Department Dialog')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Register Department
            </button>
          </div>
        </div>

        {/* Department Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="p-6 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      {dept.id}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                      {dept.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{dept.name}</h3>
                </div>

                <button
                  onClick={() => alert(`Edit Department ${dept.id}`)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {dept.mandate}
              </p>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-medium">Nodal / HOD Authority:</span>
                  <span className="text-slate-200 font-medium">{dept.hod}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-medium">Field Presence:</span>
                  <span className="text-slate-300">{dept.activeOffices}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Active Officers</span>
                  <span className="font-mono font-medium text-slate-200">{dept.activeOfficers} Active</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Average TAT</span>
                  <span className="font-mono font-medium text-blue-400">{dept.avgTat}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">SLA Compliance</span>
                  <span className="font-mono font-bold text-emerald-400">{dept.slaCompliance}</span>
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
