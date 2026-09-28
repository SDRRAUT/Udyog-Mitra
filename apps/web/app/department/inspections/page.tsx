'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  FileCheck,
  Upload,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export default function DepartmentInspectionsPage() {
  const [inspections, setInspections] = useState([
    {
      id: 'insp-joint-01',
      type: 'JOINT',
      unitName: 'Sharma Food Industries Pvt Ltd',
      appNo: 'MH-2025-PUN-00123',
      venue: 'Plot No. 45, MIDC Bhosari, Pune',
      scheduledDate: '2026-10-05T10:00:00Z',
      status: 'SCHEDULED',
      leadDept: 'MPCB',
      participatingDepts: ['MPCB', 'DISH', 'FIRE'],
      officers: ['Dr. S. Kulkarni (MPCB)', 'A. Deshmukh (DISH)', 'V. Patil (Fire)'],
      reportUploaded: false,
    },
    {
      id: 'insp-single-02',
      type: 'SINGLE',
      unitName: 'Bajaj Heavy Fabrication Works',
      appNo: 'MH-2025-PUN-00088',
      venue: 'Plot No. 12, Chakan Industrial Area, Phase II',
      scheduledDate: '2026-10-02T14:30:00Z',
      status: 'COMPLETED',
      leadDept: 'DISH',
      participatingDepts: ['DISH'],
      officers: ['A. Deshmukh (DISH)'],
      reportUploaded: true,
    },
  ]);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedInsp, setSelectedInsp] = useState<any>(null);
  const [reportRemarks, setReportRemarks] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenUpload = (insp: any) => {
    setSelectedInsp(insp);
    setUploadModalOpen(true);
  };

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInsp) return;

    setInspections((prev) =>
      prev.map((item) =>
        item.id === selectedInsp.id
          ? { ...item, status: 'COMPLETED', reportUploaded: true }
          : item
      )
    );
    setSuccessMsg(`Site inspection report uploaded for ${selectedInsp.unitName}. Synchronized across all linked departments.`);
    setUploadModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Coordinated Inspection Management Portal</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Field Site Inspections & Joint Audits
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Single-Window Joint Inspections combine MPCB, DISH, and Fire Services on a single day.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl">
              1 Joint Audit Scheduled
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Inspections List */}
        <div className="space-y-4">
          {inspections.map((insp) => (
            <div
              key={insp.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      insp.type === 'JOINT'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {insp.type === 'JOINT' ? '⚡ SINGLE WINDOW JOINT AUDIT' : 'INDIVIDUAL AUDIT'}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{insp.appNo}</span>
                  <h3 className="font-bold text-white text-base">{insp.unitName}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{insp.venue}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Scheduled: {new Date(insp.scheduledDate).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-semibold mr-1">Coordinated Officers:</span>
                  {insp.officers.map((off, oIdx) => (
                    <span
                      key={oIdx}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-200"
                    >
                      {off}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {insp.status === 'COMPLETED' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Report Uploaded & Verified</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenUpload(insp)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Joint Site Report</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Upload Inspection Report Modal */}
      {uploadModalOpen && selectedInsp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-400">Inspection Compliance</span>
                <h3 className="text-base font-black text-white">Upload Joint Inspection Audit Report</h3>
                <div className="text-xs text-slate-400">{selectedInsp.unitName}</div>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Audit Findings & Observations</label>
                <textarea
                  value={reportRemarks}
                  onChange={(e) => setReportRemarks(e.target.value)}
                  placeholder="e.g. Physical site inspection completed. ETP civil tank construction verified as per design. Fire hydrants pressure test satisfied."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 border-2 border-dashed border-slate-700 rounded-xl text-center space-y-1">
                <FileCheck className="w-6 h-6 text-cyan-400 mx-auto" />
                <div className="font-semibold text-slate-200">Joint Inspection Signed Report (PDF)</div>
                <div className="text-[10px] text-slate-400">Attached: Joint_Audit_Report_SharmaFoods.pdf (1.8 MB)</div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-500/20"
                >
                  Confirm & Sync All Linked Approvals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIChatWidget />
    </div>
  );
}
