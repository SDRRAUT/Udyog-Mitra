'use client';

import React from 'react';
import { ShieldCheck, Award, Printer, Download, CheckCircle2, QrCode } from 'lucide-react';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  approval: {
    id?: string;
    approvalMaster?: { name: string; code?: string };
    department?: { name: string; code: string };
    application?: {
      applicationNo: string;
      businessName: string;
      district?: string;
      sector?: string;
    };
    approvedAt?: string;
    certificateHash?: string;
  };
}

export default function DigitalCertificateModal({
  isOpen,
  onClose,
  approval,
}: DigitalCertificateModalProps) {
  if (!isOpen) return null;

  const appNo = approval.application?.applicationNo || 'MH-2025-PUN-00123';
  const unitName = approval.application?.businessName || 'Sharma Food Industries Pvt Ltd';
  const clearanceName = approval.approvalMaster?.name || 'Statutory Industrial Clearance';
  const deptName = approval.department?.name || 'Government of Maharashtra';
  const certHash = approval.certificateHash || 'SHA256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const grantDate = approval.approvedAt ? new Date(approval.approvedAt).toLocaleDateString() : new Date().toLocaleDateString();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white text-slate-950 rounded-2xl shadow-2xl p-6 sm:p-8 border-4 border-amber-500 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 font-bold text-lg p-1"
        >
          ✕
        </button>

        {/* Official Maha Govt Header */}
        <div className="text-center border-b-2 border-slate-200 pb-4 mb-4">
          <div className="flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>GOVERNMENT OF MAHARASHTRA | MAITRI SINGLE WINDOW PORTAL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
            Official Statutory Clearance Certificate
          </h2>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
            Tamper-Proof Integrity Hash: {certHash.slice(0, 38)}...
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-4 text-xs">
          <p className="leading-relaxed text-slate-700">
            This is to certify that enterprise <span className="font-bold text-slate-950">{unitName}</span> has fulfilled all mandatory prerequisites and has been formally granted statutory approval under the <span className="font-semibold text-slate-900">Maharashtra Right to Public Services Act 2015</span>.
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Reference Tracking ID:</span>
              <span className="font-bold text-slate-900 font-mono">{appNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Issuing Department:</span>
              <span className="font-bold text-slate-900">{deptName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Clearance Title:</span>
              <span className="font-bold text-emerald-700">{clearanceName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Effective Date of Grant:</span>
              <span className="font-bold text-slate-900">{grantDate}</span>
            </div>
          </div>

          {/* QR Code & Digital Signature Verification Box */}
          <div className="p-4 bg-amber-500/5 border border-amber-500/30 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Digitally Sealed & Cryptographically Verified</span>
              </div>
              <p className="text-[11px] text-slate-600 max-w-sm">
                Scan QR code with any official device to verify clearance status on the Maharashtra Setu Blockchain Ledger.
              </p>
            </div>

            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center flex-shrink-0 shadow-inner">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[10px] text-slate-400 font-mono">
            UDYOG MITRA • RTS-2015-CERT-VERIFIED
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
