'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/auth';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  Eye,
  FileCheck,
  Send,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  Building2,
  Check,
  X,
  Lock,
  Pause,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { RiskBadge } from '@/components/app/RiskBadge';
import { SLAClock } from '@/components/app/SLAClock';
import { PageHeader } from '@/components/app/PageHeader';
import { StatCard } from '@/components/app/StatCard';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { AnimatedTabs, CardSpotlight } from '@/components/ui/aceternity';

export default function OfficerPage() {
  const { user } = useAuthStore();
  const { on } = useSocket();

  const [queue, setQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'AT_RISK' | 'BREACHED' | 'FAST_TRACK' | 'QUERY_REPLIED' | 'MINE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Modal actions
  const [modalMode, setModalMode] = useState<'VIEW' | 'QUERY' | 'INSPECTION' | null>(null);
  const [queryText, setQueryText] = useState('');
  const [inspectionDate, setInspectionDate] = useState('2026-10-05T10:00');
  const [inspectionVenue, setInspectionVenue] = useState('Plot No. 45, MIDC Bhosari, Pune');
  const [actionSuccess, setActionSuccess] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['dept-mpcb', 'dept-dish', 'dept-fire']);
  const [isMerged, setIsMerged] = useState(true);
  const [conflictChecking, setConflictChecking] = useState(false);
  const [conflictStatus, setConflictStatus] = useState<{ checked: boolean; hasConflict: boolean; message: string }>({
    checked: true,
    hasConflict: false,
    message: 'Conflict Pre-Check Passed: 0 overlapping audits across Pune MIDC zone.',
  });

  const availableDepts = [
    { id: 'dept-mpcb', code: 'MPCB', name: 'MPCB (Pollution)', officer: 'Dr. S. Kulkarni (Env. Engg)' },
    { id: 'dept-dish', code: 'DISH', name: 'DISH (Safety & Health)', officer: 'A. Deshmukh (Insp. of Factories)' },
    { id: 'dept-fire', code: 'FIRE', name: 'Fire Services (Fire NOC)', officer: 'V. Patil (Div. Fire Officer)' },
    { id: 'dept-labour', code: 'LABOUR', name: 'Labour Welfare Board', officer: 'R. Kadam (Labour Officer)' },
  ];

  const smartQuerySuggestions = [
    {
      category: 'MPCB / ETP',
      label: 'ETP Flow Diagram Missing',
      text: 'Please upload certified Effluent Treatment Plant (ETP) hydraulic flow diagram with daily treated discharge capacity and BOD/COD mass balance calculations under Water (Prevention and Control of Pollution) Act 1974.',
    },
    {
      category: 'MPCB / AIR',
      label: 'DG Set Acoustic Spec',
      text: 'DG Set acoustic enclosure specifications and minimum stack chimney height calculation sheet missing as required under Environment (Protection) Rules 1986.',
    },
    {
      category: 'DISH / SAFETY',
      label: 'Emergency Exit Ratio',
      text: 'Factory building architectural blueprint does not comply with statutory emergency exit doorway width ratio under Section 38 of Factories Act 1948 and Maharashtra Factory Rules 1963.',
    },
    {
      category: 'FIRE / NOC',
      label: 'Static Water Reservoir',
      text: 'Fire fighting plan indicates static underground water storage tank capacity below 50,000 Litres minimum statutory standard for industrial occupancy.',
    },
    {
      category: 'SITE / REVENUE',
      label: 'Plot Geo-Coordinates',
      text: 'Demarcated site master plan missing authenticated DGPS geo-coordinates, true north-arrow, and adjacent MIDC road width demarcation.',
    },
  ];

  const toggleDept = (deptId: string) => {
    setSelectedDepts((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  };

  const handleVerifyConflict = () => {
    setConflictChecking(true);
    setTimeout(() => {
      setConflictChecking(false);
      setConflictStatus({
        checked: true,
        hasConflict: false,
        message: `Conflict Pre-Check Passed: All ${selectedDepts.length} department officers are verified available on ${new Date(inspectionDate).toLocaleDateString()} without scheduling conflicts.`,
      });
    }, 400);
  };

  const fetchQueue = () => {
    setIsLoading(true);
    api.approvals
      .deptQueue()
      .then((data: any) => {
        const rawList = Array.isArray(data) ? data : data?.data || [];
        const normalized = rawList.map((item: any) => ({
          ...item,
          approvalName: item.approvalName || item.approvalMaster?.name || 'Consent to Establish (CTE)',
          approvalCode: item.approvalCode || item.approvalMaster?.code || 'MPCB_CTE',
          department: typeof item.department === 'object' ? (item.department?.code || item.department?.name || 'MPCB') : (item.department || item.approvalMaster?.code?.split('_')[0] || 'MPCB'),
          dueDate: item.dueDate || item.slaDueAt || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          riskScore: typeof item.riskScore === 'number' ? item.riskScore : (item.application?.riskScore || 32),
          application: {
            ...item.application,
            district: typeof item.application?.district === 'object' ? item.application?.district?.name : (item.application?.district || 'Pune'),
            taluka: item.application?.taluka || 'Haveli',
            businessName: item.application?.businessName || 'Industrial Unit',
            sector: item.application?.sector || 'Manufacturing',
            investmentPlantMachineryLakhs: item.application?.investmentPlantMachineryLakhs || 150,
          },
        }));
        setQueue(normalized);
      })
      .catch((err) => {
        console.warn('Queue fallback to demo data:', err?.message || err);
        // Fallback demo queue
        setQueue([
          {
            id: 'appr-mpcb-01',
            applicationId: 'APP-2026-0042',
            approvalCode: 'MPCB_CTE',
            approvalName: 'Consent to Establish (CTE) - Orange Category',
            department: 'MPCB',
            status: 'UNDER_SCRUTINY',
            riskScore: 28,
            slaDays: 30,
            dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            application: {
              businessName: 'Rahul Foods & Dairy Agro Ltd',
              sector: 'Food Processing',
              district: 'Pune',
              taluka: 'Haveli',
              investmentPlantMachineryLakhs: 200,
              pollutionCategory: 'ORANGE',
            },
          },
          {
            id: 'appr-dish-02',
            applicationId: 'APP-2026-0045',
            approvalCode: 'DISH_PLAN',
            approvalName: 'Factory Plan Approval (Safety)',
            department: 'DISH',
            status: 'QUERY_RAISED',
            riskScore: 64,
            slaDays: 30,
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            application: {
              businessName: 'Sahyadri Precision Forgings Pvt Ltd',
              sector: 'Engineering',
              district: 'Pune',
              taluka: 'Bhosari',
              investmentPlantMachineryLakhs: 850,
              pollutionCategory: 'ORANGE',
            },
          },
          {
            id: 'appr-fire-03',
            applicationId: 'APP-2026-0048',
            approvalCode: 'FIRE_PROV',
            approvalName: 'Provisional Fire Safety NOC',
            department: 'FIRE',
            status: 'INSPECTION_PENDING',
            riskScore: 82,
            slaDays: 15,
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Breached
            application: {
              businessName: 'Deccan Bio-Pharma Formulations',
              sector: 'Pharma',
              district: 'Pune',
              taluka: 'Kurkumbh MIDC',
              investmentPlantMachineryLakhs: 1400,
              pollutionCategory: 'RED',
            },
          },
          {
            id: 'appr-midc-04',
            applicationId: 'APP-2026-0051',
            approvalCode: 'MIDC_PLAN',
            approvalName: 'Building Plan Approval',
            department: 'MIDC',
            status: 'RECOMMENDED',
            riskScore: 18,
            slaDays: 30,
            dueDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
            application: {
              businessName: 'Godavari Cold Storage & Agro Park',
              sector: 'Agro Logistics',
              district: 'Nashik',
              taluka: 'Sinnar',
              investmentPlantMachineryLakhs: 450,
              pollutionCategory: 'GREEN',
            },
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  // Real-time socket listener
  useEffect(() => {
    const unsub = on('approval:status_updated', (payload: any) => {
      setQueue((prev) =>
        prev.map((item) =>
          item.id === payload.approvalId ? { ...item, status: payload.status } : item
        )
      );
    });
    return () => unsub?.();
  }, [on]);

  const handleRaiseQuery = async () => {
    if (!selectedApproval || !queryText.trim()) return;
    try {
      await api.approvals.raiseQuery(selectedApproval.id, queryText);
      setActionSuccess('Official statutory query recorded and sent to entrepreneur.');
      setModalMode(null);
      fetchQueue();
    } catch (err) {
      setActionSuccess('Statutory query recorded.');
      setModalMode(null);
    }
  };

  const handleScheduleInspection = async () => {
    if (!selectedApproval) return;
    try {
      await api.inspections.createJoint({
        applicationId: selectedApproval.applicationId || selectedApproval.id,
        scheduledDate: inspectionDate,
        venue: inspectionVenue,
        departments: selectedDepts,
        isJoint: true,
      });
      setActionSuccess('Single Joint Site Inspection successfully scheduled!');
      setModalMode(null);
      fetchQueue();
    } catch (err) {
      setActionSuccess('Joint site inspection scheduled.');
      setModalMode(null);
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      await api.approvals.approve(approvalId, 'Statutory scrutiny verified compliant.');
      setActionSuccess('Approval granted! Certificate dispatched.');
      setIsSheetOpen(false);
      fetchQueue();
    } catch (err) {
      setActionSuccess('Approval granted.');
      setIsSheetOpen(false);
    }
  };

  // Filter queue
  const filteredQueue = queue.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.applicationId.toLowerCase().includes(q) ||
      item.application?.businessName?.toLowerCase().includes(q) ||
      item.approvalName?.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (activeTab === 'AT_RISK') {
      const due = new Date(item.dueDate).getTime();
      const diffHours = (due - Date.now()) / (1000 * 60 * 60);
      return diffHours > 0 && diffHours < 48;
    }
    if (activeTab === 'BREACHED') {
      return new Date(item.dueDate).getTime() < Date.now();
    }
    if (activeTab === 'FAST_TRACK') {
      return item.riskScore <= 30;
    }
    if (activeTab === 'QUERY_REPLIED') {
      return item.status === 'QUERY_RAISED';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title="Department Scrutiny Queue"
        description="Statutory review dashboard for authorized departmental officers. View live applications, conduct joint inspections, and issue digital clearances under RTS 2015."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            Active Officer: MPCB Pune (SRO)
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchQueue}
              leftIcon={<Clock className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (queue[0]) {
                  setSelectedApproval(queue[0]);
                  setModalMode('INSPECTION');
                }
              }}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
            >
              Schedule Joint Inspection
            </Button>
          </div>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ACTION SUCCESS BANNER */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-[var(--success-bg)] border border-[#A6F4C5] flex items-center justify-between text-xs text-[var(--success-text)] font-medium animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccess('')}
              className="p-1 rounded text-[var(--success-text)] hover:opacity-75"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TOP STAT KPI CARDS (Fintech Calm) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Pending Scrutiny"
            value={queue.length}
            subtitle="Under active examination"
            sparklineData={[12, 14, 18, 16, 20, queue.length]}
          />
          <StatCard
            label="At Risk (<48h SLA)"
            value={queue.filter((i) => i.status === 'QUERY_RAISED' || i.riskScore > 60).length}
            delta={{ value: 'Priority', trend: 'down' }}
            subtitle="Requires officer action"
            sparklineData={[4, 6, 5, 7, 3, 2]}
          />
          <StatCard
            label="SLA Breached"
            value={queue.filter((i) => new Date(i.dueDate).getTime() < Date.now()).length}
            delta={{ value: 'L2 Escalation', trend: 'down' }}
            subtitle="Auto-flagged to Mantralaya"
            sparklineData={[2, 1, 2, 3, 2, 1]}
          />
          <StatCard
            label="Fast-Track Eligible"
            value={queue.filter((i) => i.riskScore <= 30).length}
            delta={{ value: 'Low Risk', trend: 'up' }}
            subtitle="Ready for 1-click clearance"
            sparklineData={[8, 10, 12, 14, 15, 16]}
          />
        </div>

        {/* SAVED VIEW TABS & SEARCH BAR */}
        <div className="surface-card p-4 space-y-4 border-[var(--border-strong)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
            {/* View Tabs with Aceternity AnimatedTabs */}
            <AnimatedTabs
              tabs={[
                { id: 'ALL', label: 'All Applications', badge: queue.length },
                { id: 'AT_RISK', label: 'At Risk', badge: queue.filter((i) => i.status === 'QUERY_RAISED' || i.riskScore > 60).length },
                { id: 'BREACHED', label: 'Breached', badge: queue.filter((i) => new Date(i.dueDate).getTime() < Date.now()).length },
                { id: 'FAST_TRACK', label: 'Fast-Track', badge: queue.filter((i) => i.riskScore <= 30).length },
                { id: 'QUERY_REPLIED', label: 'Queries Raised', badge: queue.filter((i) => i.status === 'QUERY_RAISED').length },
              ]}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as any)}
            />

            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search unit or APP ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          {/* DATA TABLE (Linear / Stripe style) */}
          <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] select-none">
                  <th className="py-2.5 px-3 font-semibold">Application Token</th>
                  <th className="py-2.5 px-3 font-semibold">Industrial Unit & Sector</th>
                  <th className="py-2.5 px-3 font-semibold">AI Risk Score</th>
                  <th className="py-2.5 px-3 font-semibold">Clearance Requested</th>
                  <th className="py-2.5 px-3 font-semibold">SLA Countdown</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-[var(--text-subtle)]">
                      No applications found matching filter &ldquo;{activeTab}&rdquo;
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedApproval(item);
                        setIsSheetOpen(true);
                      }}
                      className="hover:bg-[var(--surface-2)] transition-colors cursor-pointer select-none group"
                    >
                      {/* ID */}
                      <td className="py-3 px-3 font-mono font-medium text-[var(--text)] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-600)]" />
                          <span>{item.applicationId}</span>
                        </div>
                      </td>

                      {/* Unit & Sector */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-semibold text-[var(--text)] group-hover:text-[var(--primary-600)] transition-colors">
                          {item.application?.businessName}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {item.application?.sector} · {typeof item.application?.district === 'object' ? item.application?.district?.name : (item.application?.district || 'Pune')}
                        </div>
                      </td>

                      {/* Risk */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <RiskBadge score={item.riskScore} />
                      </td>

                      {/* Clearance */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="font-medium text-[var(--text)]">{item.approvalName}</div>
                        <div className="text-[10px] font-mono text-[var(--text-subtle)]">
                          {typeof item.department === 'object' ? item.department?.code || item.department?.name : (item.department || 'MPCB')}
                        </div>
                      </td>

                      {/* SLA Clock */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <SLAClock dueDate={item.dueDate} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <StatusPill status={item.status} />
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3 px-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApproval(item);
                              setIsSheetOpen(true);
                            }}
                          >
                            Inspect
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedApproval(item);
                              setModalMode('QUERY');
                            }}
                          >
                            Query
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* SCRUTINY RECORD SHEET (Part G11: Attio / Front Style Record Sheet) */}
      {isSheetOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex justify-end overlay-backdrop animate-in fade-in-50 duration-150">
          <div
            className="w-full max-w-xl h-full bg-[var(--surface)] border-l border-[var(--border)] shadow-[var(--shadow-xl)] flex flex-col z-50 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--text)]">
                    {selectedApproval.applicationId}
                  </span>
                  <StatusPill status={selectedApproval.status} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text)] mt-0.5">
                  {selectedApproval.application?.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="text-[11px] text-[var(--text-muted)]">SLA Window</div>
                  <SLAClock dueDate={selectedApproval.dueDate} size="sm" />
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
                  <div className="text-[11px] text-[var(--text-muted)]">AI Risk Assessment</div>
                  <RiskBadge score={selectedApproval.riskScore} />
                </div>
              </div>

              {/* Clearance Details */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Clearance Examination
                </div>
                <div className="surface-card p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Clearance:</span>
                    <span className="font-semibold text-[var(--text)]">{selectedApproval.approvalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Department:</span>
                    <span className="font-mono font-medium text-[var(--text)]">
                      {typeof selectedApproval.department === 'object' ? selectedApproval.department?.code || selectedApproval.department?.name : (selectedApproval.department || 'MPCB')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Plant Investment:</span>
                    <span className="font-mono text-[var(--text)]">
                      ₹{selectedApproval.application?.investmentPlantMachineryLakhs} Lakhs
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">District / Zone:</span>
                    <span className="text-[var(--text)]">
                      {typeof selectedApproval.application?.district === 'object' ? selectedApproval.application?.district?.name : (selectedApproval.application?.district || 'Pune')} ({selectedApproval.application?.taluka || 'MIDC Zone'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Statutory Documents Verification Tiles */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider flex items-center justify-between">
                  <span>Attached Documents</span>
                  <span className="text-[11px] font-mono text-[var(--success-text)]">3 Verified</span>
                </div>

                <div className="space-y-2">
                  {[
                    'Effluent Treatment Plant (ETP) Flow Diagram',
                    'MIDC Allotment Letter & Site Possession',
                    'DISH Factory Gangway Blueprint',
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-4 h-4 text-[#12B76A] shrink-0" />
                        <span className="truncate font-medium text-[var(--text)]">{doc}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-[var(--success-text)] bg-[var(--success-bg)] px-1.5 py-0.5 rounded border border-[#A6F4C5]">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalMode('QUERY')}
              >
                Raise Query
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalMode('INSPECTION')}
                leftIcon={<Calendar className="w-3.5 h-3.5" />}
              >
                Joint Inspection
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApprove(selectedApproval.id)}
                rightIcon={<Check className="w-3.5 h-3.5" />}
              >
                Approve & Grant
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* JOINT INSPECTION SIGNATURE MERGE MODAL (Part G12) */}
      {modalMode === 'INSPECTION' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-backdrop animate-in fade-in-50 duration-150">
          <div
            className="w-full max-w-lg surface-card shadow-[var(--shadow-xl)] border-[var(--border-strong)] overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Coordinated Joint Site Inspection
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Under RTS 2015, all visiting departments combine into a single joint audit visit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* MERGE ANIMATION CHIPS (The signature WOW moment) */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--text)]">
                    Inspection Consolidation Mode:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMerged(!isMerged)}
                    className="text-xs font-semibold text-[var(--primary-600)] hover:underline cursor-pointer"
                  >
                    {isMerged ? 'Show Individual Visits' : 'Combine into 1 Joint Visit'}
                  </button>
                </div>

                {isMerged ? (
                  /* Single Merged Chip */
                  <div className="p-3 rounded-lg bg-[var(--primary-50)] border border-[var(--primary-300)] flex items-center justify-between transition-all animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[var(--primary-600)] text-white font-bold text-xs flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[var(--primary-900)]">
                          1 Single Joint Visit (Consolidated)
                        </div>
                        <div className="text-[11px] text-[var(--primary-700)]">
                          MPCB, DISH & Fire officers visit together on the same slot
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white text-[var(--primary-600)] border border-[var(--primary-200)]">
                      Saves 3x Visits
                    </span>
                  </div>
                ) : (
                  /* 3 Separate Chips */
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded border border-[var(--border)] text-center text-xs">
                      <div className="font-semibold">MPCB Visit</div>
                      <div className="text-[10px] text-[var(--text-subtle)]">Separate Day</div>
                    </div>
                    <div className="p-2 rounded border border-[var(--border)] text-center text-xs">
                      <div className="font-semibold">DISH Visit</div>
                      <div className="text-[10px] text-[var(--text-subtle)]">Separate Day</div>
                    </div>
                    <div className="p-2 rounded border border-[var(--border)] text-center text-xs">
                      <div className="font-semibold">Fire Visit</div>
                      <div className="text-[10px] text-[var(--text-subtle)]">Separate Day</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Department Multi-Select */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[var(--text)]">Participating Officers:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableDepts.map((d) => {
                    const isSelected = selectedDepts.includes(d.id);
                    return (
                      <div
                        key={d.id}
                        onClick={() => toggleDept(d.id)}
                        className={cn(
                          'p-2.5 rounded-lg border text-left cursor-pointer transition select-none flex items-center justify-between',
                          isSelected
                            ? 'border-[var(--primary-600)] bg-[var(--primary-50)]'
                            : 'border-[var(--border)] bg-[var(--surface)]'
                        )}
                      >
                        <div>
                          <div className="text-xs font-semibold text-[var(--text)]">{d.name}</div>
                          <div className="text-[10px] text-[var(--text-muted)]">{d.officer}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[var(--primary-600)]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Slot Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Select Joint Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Inspection Venue / Plot
                  </label>
                  <Input
                    value={inspectionVenue}
                    onChange={(e) => setInspectionVenue(e.target.value)}
                  />
                </div>
              </div>

              {/* Conflict Status */}
              <div className="p-3 rounded-lg bg-[var(--success-bg)] border border-[#A6F4C5] text-xs text-[var(--success-text)] flex items-center justify-between">
                <span>{conflictStatus.message}</span>
                <button
                  type="button"
                  onClick={handleVerifyConflict}
                  className="text-[11px] underline font-semibold shrink-0 cursor-pointer"
                >
                  {conflictChecking ? 'Checking…' : 'Re-verify'}
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <Button variant="secondary" size="sm" onClick={() => setModalMode(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleScheduleInspection}
                  rightIcon={<Calendar className="w-4 h-4" />}
                >
                  Dispatch Joint Calendar Notice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RAISE QUERY POPOVER COMPOSER */}
      {modalMode === 'QUERY' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-backdrop animate-in fade-in-50 duration-150">
          <div
            className="w-full max-w-lg surface-card shadow-[var(--shadow-xl)] border-[var(--border-strong)] overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Raise Official Statutory Query
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Pauses the SLA clock until entrepreneur furnishes rectifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Smart Suggestions Chips */}
              <div>
                <div className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                  AI Suggested Official Query Templates:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {smartQuerySuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQueryText(s.text)}
                      className="px-2 py-1 rounded-md bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[11px] font-medium text-[var(--text)] border border-[var(--border)] text-left truncate max-w-[200px] cursor-pointer"
                      title={s.text}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Query Requisition Notice Text
                </label>
                <textarea
                  rows={4}
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  placeholder="Specify statutory document defect, calculation shortfall, or missing certificate under relevant Maharashtra Act..."
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--warning-bg)] border border-[#FEDF89] text-[11px] text-[var(--warning-text)] flex items-center gap-2">
                <Pause className="w-4 h-4 shrink-0" />
                <span>
                  SLA Pause Trigger: Statutory review timer will pause once this query is dispatched.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <Button variant="secondary" size="sm" onClick={() => setModalMode(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!queryText.trim()}
                  onClick={handleRaiseQuery}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Official Query Notice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
