'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { StatusPill } from '@/components/ui/StatusPill';
import { Button } from '@/components/ui/Button';
import DigitalCertificateModal from '@/components/DigitalCertificateModal';
import {
  Search,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';

export default function PublicTrackPage() {
  const [searchQuery, setSearchQuery] = useState('MH-2025-PUN-00123');
  const [isSearching, setIsSearching] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [selectedCertApproval, setSelectedCertApproval] = useState<any>(null);

  const performSearch = (query: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setApplicationData({
        applicationNo: query.trim() || 'MH-2025-PUN-00123',
        businessName: 'Sharma Food Industries Pvt Ltd',
        sector: 'FOOD_PROCESSING',
        subSector: 'Agro & Ready-to-Eat Food Processing',
        district: 'Pune',
        taluka: 'Haveli',
        locationType: 'MIDC',
        industrialArea: 'MIDC Bhosari Industrial Park, Block B',
        submittedAt: '2026-09-18T10:30:00.000Z',
        statutorySlaDueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        overallStatus: 'UNDER_SCRUTINY',
        totalInvestmentLakhs: 450,
        proposedEmployment: 35,
        approvals: [
          {
            id: 'appr-midc-01',
            department: 'MIDC',
            deptName: 'Maharashtra Industrial Development Corp',
            approvalName: 'Water Supply Connection & Plot Possession',
            status: 'APPROVED',
            slaDaysRemaining: 0,
            approvedAt: '2026-09-22T14:15:00.000Z',
            officerName: 'K. Deshpande (Executive Engineer)',
            certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          },
          {
            id: 'appr-fire-02',
            department: 'FIRE',
            deptName: 'Maharashtra Fire Services',
            approvalName: 'Fire Safety Clearance NOC',
            status: 'APPROVED',
            slaDaysRemaining: 0,
            approvedAt: '2026-09-24T11:20:00.000Z',
            officerName: 'V. Patil (Divisional Fire Officer)',
            certificateHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
          },
          {
            id: 'appr-mpcb-03',
            department: 'MPCB',
            deptName: 'Maharashtra Pollution Control Board',
            approvalName: 'Consent to Establish (CTE) - Orange Category',
            status: 'UNDER_SCRUTINY',
            slaDaysRemaining: 18,
            officerName: 'Dr. S. Kulkarni (Regional Officer)',
            inspectionScheduled: '2026-10-05T10:00:00.000Z',
          },
          {
            id: 'appr-dish-04',
            department: 'DISH',
            deptName: 'Directorate of Industrial Safety & Health',
            approvalName: 'Factory Plan Approval & Registration',
            status: 'UNDER_SCRUTINY',
            slaDaysRemaining: 21,
            officerName: 'A. Deshmukh (Inspector of Factories)',
            inspectionScheduled: '2026-10-05T10:00:00.000Z',
          },
        ],
      });
      setIsSearching(false);
    }, 250);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, []);

  const openCertificate = (approval: any) => {
    setSelectedCertApproval({
      ...approval,
      approvalMaster: { name: approval.approvalName },
      department: { name: approval.deptName, code: approval.department },
      application: {
        applicationNo: applicationData.applicationNo,
        businessName: applicationData.businessName,
      },
    });
    setCertificateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-[var(--primary-100)] selection:text-[var(--primary-900)]">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8 min-w-0">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#12B76A]" />
            <span>Maharashtra Right to Public Services Act (RTS 2015)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Zero-Login Industrial Clearance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            Live parallel scrutiny tracker, officer assignment matrix, and instant cryptographic certificate verification.
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-2 sm:p-2.5 rounded-xl surface-card border border-[var(--border)] shadow-xs flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
              placeholder="Enter Application No (e.g. MH-2025-PUN-00123) or Enterprise Name..."
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
            />
          </div>
          <Button
            onClick={() => performSearch(searchQuery)}
            disabled={isSearching}
            loading={isSearching}
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Track Clearance
          </Button>
        </div>

        {/* Application Status Card */}
        {applicationData && (
          <div className="space-y-6">
            {/* Top Unit Banner */}
            <div className="p-5 sm:p-6 rounded-xl surface-card border border-[var(--border)] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--border)] pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[var(--primary-700)] bg-[var(--primary-50)] px-2 py-0.5 rounded border border-[var(--primary-200)]">
                      {applicationData.applicationNo}
                    </span>
                    <span className="text-[var(--text-subtle)]">•</span>
                    <span className="text-xs text-[var(--text-muted)]">{applicationData.district}, Maharashtra</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[var(--text)] mt-1.5">
                    {applicationData.businessName}
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusPill status={applicationData.overallStatus} />
                </div>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[var(--text-subtle)] block text-[11px]">Industrial Cluster:</span>
                  <span className="font-medium text-[var(--text)]">{applicationData.industrialArea}</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)] block text-[11px]">Sector Classification:</span>
                  <span className="font-medium text-[var(--text)]">{applicationData.subSector}</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)] block text-[11px]">Proposed Investment:</span>
                  <span className="font-semibold text-[var(--text)]">₹{applicationData.totalInvestmentLakhs} Lakhs</span>
                </div>
                <div>
                  <span className="text-[var(--text-subtle)] block text-[11px]">Statutory SLA Deadline:</span>
                  <span className="font-semibold text-[#12B76A] flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 shrink-0" />
                    18 Days Remaining
                  </span>
                </div>
              </div>
            </div>

            {/* Parallel Clearance Scrutiny Pipeline */}
            <div className="p-5 sm:p-6 rounded-xl surface-card border border-[var(--border)] shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-[var(--primary-600)]" />
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--text)]">
                    Parallel Inter-Departmental Scrutiny Pipeline
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-[var(--success-text)] bg-[var(--success-bg)] px-2.5 py-0.5 rounded-full border border-[#A6F4C5]">
                  2 / 4 Clearances Issued
                </span>
              </div>

              <div className="space-y-2.5">
                {applicationData.approvals.map((appr: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-[var(--border-strong)] transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--primary-700)] font-mono border border-[var(--border)]">
                          {appr.department}
                        </span>
                        <h4 className="font-semibold text-xs sm:text-sm text-[var(--text)] truncate">{appr.approvalName}</h4>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] flex flex-wrap items-center gap-2">
                        <span>{appr.deptName}</span>
                        <span>•</span>
                        <span>Designated Officer: {appr.officerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <StatusPill status={appr.status} />

                      {appr.status === 'APPROVED' ? (
                        <button
                          onClick={() => openCertificate(appr)}
                          className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--surface-3)] text-[var(--text)] border border-[var(--border)] shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#12B76A]" />
                          <span>View Seal</span>
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="text-[11px] text-[var(--warning-text)] font-mono font-medium block">
                            {appr.slaDaysRemaining} Days SLA
                          </span>
                          {appr.inspectionScheduled && (
                            <span className="text-[10px] text-[var(--primary-600)] block">
                              Joint Audit: 05-Oct
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Digital Certificate Modal */}
      {selectedCertApproval && (
        <DigitalCertificateModal
          isOpen={certificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
          approval={selectedCertApproval}
        />
      )}
    </div>
  );
}
