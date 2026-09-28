'use client';

import React, { use } from 'react';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  FileCheck,
  Printer,
  Award,
  Building2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';

export default function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ certNo: string }>;
}) {
  const unwrappedParams = use(params);
  const certNo = unwrappedParams.certNo || 'CERT-MH-2026-PUN-00123';

  const certificateData = {
    certNo,
    isValid: true,
    issuedAt: '2026-09-24T10:30:00Z',
    validUntil: '2031-09-23T23:59:59Z',
    clearanceTitle: 'Consent to Establish (CTE) & Factory Registration',
    department: 'Maharashtra Pollution Control Board (MPCB) & DISH',
    enterpriseName: 'Sharma Food Industries Pvt Ltd',
    applicationNo: 'MH-2026-PUN-00123',
    district: 'Pune',
    taluka: 'Haveli',
    industrialArea: 'MIDC Bhosari Industrial Park, Block B',
    panNo: 'ABCPS1234D',
    udyamNo: 'UDYAM-MH-27-0001234',
    category: 'ORANGE (Food Processing)',
    digitalSealHash: 'SHA256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    approvingAuthority: 'Dr. S. Kulkarni (Regional Officer, MPCB)',
    actReference: 'Water Act 1974 §25 & Maharashtra RTS Act 2015 §7',
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        {/* Verification Status Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--success-bg)] border border-[#A6F4C5] text-[var(--success-text)] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
            <span>Authenticated on Maharashtra Public Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
            Statutory Certificate Authenticity Verification
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
            Public verification portal for investors, banks, and regulatory bodies under RTS Act 2015.
          </p>
        </div>

        {/* Certificate Card (Clean, Printable Trust-First Layout) */}
        <div className="surface-card p-6 sm:p-10 border-[var(--border-strong)] shadow-[var(--shadow-lg)] relative space-y-6">
          {/* Header */}
          <div className="text-center border-b border-[var(--border)] pb-5 space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <ShieldCheck className="w-4 h-4 text-[var(--primary-600)]" />
              <span>Government of Maharashtra · UDYOG MITRA Single Window</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)] uppercase tracking-tight">
              Official Statutory Clearance Certificate
            </h2>
            <div className="text-xs font-mono text-[var(--text-subtle)]">
              Certificate No: <span className="font-semibold text-[var(--text)]">{certificateData.certNo}</span>
            </div>
          </div>

          {/* Verification Status Pill Block */}
          <div className="p-4 rounded-xl bg-[var(--success-bg)] border border-[#A6F4C5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#12B76A] shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-[var(--success-text)]">
                  ACTIVE & STATUTORILY VALID
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  Compliant with {certificateData.actReference}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[var(--text-subtle)] block">Valid Until:</span>
              <span className="font-mono font-semibold text-xs text-[var(--text)]">
                {new Date(certificateData.validUntil).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[var(--text-subtle)]">Enterprise Name:</span>
              <div className="font-semibold text-[var(--text)]">{certificateData.enterpriseName}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[var(--text-subtle)]">Clearance Granted:</span>
              <div className="font-semibold text-[var(--text)]">{certificateData.clearanceTitle}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[var(--text-subtle)]">Issuing Authority:</span>
              <div className="font-medium text-[var(--text)]">{certificateData.approvingAuthority}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[var(--text-subtle)]">Industrial Zone:</span>
              <div className="font-medium text-[var(--text)]">{certificateData.industrialArea}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[var(--text-subtle)]">Pollution Category:</span>
              <div className="font-mono text-[var(--text)]">{certificateData.category}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[var(--text-subtle)]">Udyam Registration:</span>
              <div className="font-mono text-[var(--text)]">{certificateData.udyamNo}</div>
            </div>
          </div>

          {/* Digital Signature Hash */}
          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[11px] space-y-1">
            <div className="flex items-center justify-between text-[var(--text-subtle)]">
              <span>Tamper-Proof Cryptographic Hash (SHA-256):</span>
              <span className="text-[10px] text-[#12B76A] font-semibold">Ledger Verified</span>
            </div>
            <div className="font-mono text-[10px] text-[var(--text-muted)] truncate">
              {certificateData.digitalSealHash}
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Print Verification Record
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
