'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  UserCheck,
  FileText,
  Clock,
  Lock
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const auditLogs = [
    {
      id: 'log-1',
      timestamp: '2026-09-27T12:05:14Z',
      user: 'Dr. S. Kulkarni (MPCB Officer)',
      ip: '10.24.18.92',
      action: 'APPROVE_CLEARANCE',
      resource: 'Approval #appr-mpcb-01 (CTE Orange Category)',
      details: 'Granted digital clearance with cryptographic SHA-256 seal.',
      status: 'SUCCESS',
    },
    {
      id: 'log-2',
      timestamp: '2026-09-27T11:42:02Z',
      user: 'SYSTEM (SLA Cron Worker)',
      ip: '127.0.0.1 (Local Daemon)',
      action: 'SLA_ESCALATION_TRIGGERED',
      resource: 'Approval #appr-dish-02 (Factory Plan Approval)',
      details: 'SLA breached threshold. Auto-escalated from L1 Designated Officer to L2 Department HOD.',
      status: 'SYSTEM_EVENT',
    },
    {
      id: 'log-3',
      timestamp: '2026-09-27T11:15:30Z',
      user: 'A. Deshmukh (DISH Officer)',
      ip: '10.24.20.15',
      action: 'RAISE_STATUTORY_QUERY',
      resource: 'Approval #appr-dish-02',
      details: 'Raised statutory query regarding emergency doorway width ratio under Factories Act 1948.',
      status: 'SUCCESS',
    },
    {
      id: 'log-4',
      timestamp: '2026-09-27T10:30:18Z',
      user: 'Rajesh Sharma (Entrepreneur)',
      ip: '115.112.44.89',
      action: 'SUBMIT_COMMON_APPLICATION',
      resource: 'Application #MH-2025-PUN-00123',
      details: 'Submitted 5-section CAF with 4 parallel clearance dispatches and verified reusable documents.',
      status: 'SUCCESS',
    },
    {
      id: 'log-5',
      timestamp: '2026-09-27T09:12:44Z',
      user: 'Principal Secretary (State Admin)',
      ip: '10.1.0.4',
      action: 'PUBLISH_RULE_VERSION',
      resource: 'ChecklistRule AST Engine (v14.2)',
      details: 'Published new statutory rule version for CPCB Orange Category food processing clusters.',
      status: 'AUDIT_SEALED',
    },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Maharashtra_Setu_Audit_Log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Immutable Regulatory Audit Trail</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Statutory System Audit Logs
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Append-only tamper-proof ledger of every user action, officer scrutiny transition, and automated SLA escalation.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Audit Trail</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, action, resource, IP..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Actions</option>
              <option value="APPROVE_CLEARANCE">APPROVE_CLEARANCE</option>
              <option value="SLA_ESCALATION_TRIGGERED">SLA_ESCALATION_TRIGGERED</option>
              <option value="RAISE_STATUTORY_QUERY">RAISE_STATUTORY_QUERY</option>
              <option value="SUBMIT_COMMON_APPLICATION">SUBMIT_COMMON_APPLICATION</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Actor / Principal</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Resource Target</th>
                  <th className="p-3">Audit Details</th>
                  <th className="p-3 text-right">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-white">
                      <div>{log.user}</div>
                      <div className="text-[10px] font-mono text-slate-500">{log.ip}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-400 text-[11px]">
                      {log.action}
                    </td>
                    <td className="p-3 text-slate-300 text-[11px]">
                      {log.resource}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px] max-w-sm">
                      {log.details}
                    </td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {log.status}
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
