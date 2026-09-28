'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useSocket, useRealtimeTimeline } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  MessageSquare,
  Send,
  Calendar,
  FileCheck,
  ShieldCheck,
  Download,
  QrCode,
  FileText,
  User,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Pause,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { SLAClock } from '@/components/app/SLAClock';
import { RiskBadge } from '@/components/app/RiskBadge';
import { PageHeader } from '@/components/app/PageHeader';
import { cn } from '@/lib/utils';
import {
  AnimatedTabs,
  CardSpotlight,
  TracingTimeline,
  TimelineEntry,
} from '@/components/ui/aceternity';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params?.id as string;

  const [application, setApplication] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DOCUMENTS' | 'QUERIES' | 'TIMELINE'>('OVERVIEW');
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [queries, setQueries] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [prevalidation, setPrevalidation] = useState<any>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Real-time timeline from WebSocket
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);
  useRealtimeTimeline(applicationId, (event) => {
    setRealtimeEvents((prev) => [event, ...prev]);
    fetchDetails();
  });

  // Fetch application details
  const fetchDetails = () => {
    if (!applicationId) return;
    setIsLoading(true);
    api.applications
      .get(applicationId)
      .then((data) => {
        setApplication(data);
        if (data?.approvals?.length > 0) {
          const defaultAppr = data.approvals[0];
          setSelectedApproval(defaultAppr);
          loadQueries(defaultAppr.id);
        }
      })
      .catch((err) => {
        console.error('Error fetching application:', err);
        // Demo fallback
        setApplication({
          id: applicationId,
          applicationNo: applicationId.toUpperCase(),
          businessName: 'Rahul Foods & Dairy Agro Ltd',
          sector: 'Food Processing',
          locationType: 'MIDC',
          district: { name: 'Pune' },
          status: 'UNDER_SCRUTINY',
          riskScore: 28,
          createdAt: new Date().toISOString(),
          approvals: [
            {
              id: 'ap1',
              approvalMaster: { name: 'Consent to Establish (CTE)' },
              department: { code: 'MPCB', name: 'Maharashtra Pollution Control Board' },
              status: 'UNDER_SCRUTINY',
              slaDays: 30,
              dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'ap2',
              approvalMaster: { name: 'Factory Plan Approval' },
              department: { code: 'DISH', name: 'Directorate of Industrial Safety & Health' },
              status: 'QUERY_RAISED',
              slaDays: 30,
              dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'ap3',
              approvalMaster: { name: 'Provisional Fire Safety NOC' },
              department: { code: 'FIRE', name: 'Maharashtra Fire Services' },
              status: 'INSPECTION_PENDING',
              slaDays: 15,
              dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: 'ap4',
              approvalMaster: { name: 'Building Plan Approval' },
              department: { code: 'MIDC', name: 'Maharashtra Industrial Development Corp' },
              status: 'APPROVED',
              slaDays: 30,
              dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ],
        });
      })
      .finally(() => setIsLoading(false));

    fetchDocsAndPreval();
  };

  const fetchDocsAndPreval = () => {
    api.documents
      .list(applicationId)
      .then((docs) => setUploadedDocs(docs || []))
      .catch(() => {
        setUploadedDocs([
          {
            docCode: 'ETP_FLOW',
            docName: 'Certified Effluent Treatment Plant Flow Diagram',
            status: 'VALID',
            fileSize: '2.4 MB',
          },
          {
            docCode: 'SITE_PLAN',
            docName: 'Architectural Site Layout with True North',
            status: 'VALID',
            fileSize: '4.1 MB',
          },
          {
            docCode: 'DISH_GANGWAY',
            docName: 'Factory Machine Layout & Emergency Exits',
            status: 'WARNING',
            fileSize: '1.8 MB',
          },
        ]);
      });
  };

  const loadQueries = (approvalId: string) => {
    api.approvals
      .getQueries(approvalId)
      .then((data) => setQueries(data || []))
      .catch(() => {
        setQueries([
          {
            id: 'q1',
            queryText:
              'Kindly clarify internal factory gangway dimension spacing between machine bays #2 and #3 to ensure compliant fire escape ratio under Section 38 of Factories Act 1948.',
            department: 'DISH',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          },
        ]);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, [applicationId]);

  const handleReplyQuery = async (queryId: string) => {
    if (!replyText.trim()) return;
    setIsSubmittingReply(true);
    try {
      await api.approvals.replyQuery(selectedApproval?.id || applicationId, queryId, replyText);
      setReplyText('');
      loadQueries(selectedApproval?.id);
    } catch (err) {
      console.warn('Reply error fallback:', err);
      setQueries((prev) =>
        prev.map((q) =>
          q.id === queryId ? { ...q, status: 'REPLIED', replyText: replyText } : q
        )
      );
      setReplyText('');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const copyAppId = () => {
    navigator.clipboard?.writeText(applicationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title={application?.businessName || 'Sharma Food Industries Pvt Ltd'}
        description={`Statutory clearance dossier · ${application?.sector || 'Food Processing'} · ${application?.district?.name || 'Pune MIDC'}`}
        badge={
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] flex items-center gap-1">
              <span>{applicationId}</span>
              <button
                type="button"
                onClick={copyAppId}
                className="text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                {copiedId ? <Check className="w-3 h-3 text-[#12B76A]" /> : <Copy className="w-3 h-3" />}
              </button>
            </span>
            <StatusPill status={application?.status || 'UNDER_SCRUTINY'} />
            <RiskBadge score={application?.riskScore || 28} />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/entrepreneur/dashboard')}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Dashboard
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert('Clearance Dossier downloaded with official digital QR.')}
            >
              Export Dossier PDF
            </Button>
          </div>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ACETERNITY ANIMATED TABS */}
        <div className="pb-1 border-b border-[var(--border)]">
          <AnimatedTabs
            tabs={[
              { id: 'OVERVIEW', label: 'Clearances Overview' },
              { id: 'DOCUMENTS', label: 'Statutory Documents' },
              { id: 'QUERIES', label: 'Department Queries' },
              { id: 'TIMELINE', label: 'Statutory Event Timeline' },
            ]}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as any)}
          />
        </div>

        {/* TAB 1: OVERVIEW (Grid of Department Approval Cards with CardSpotlight) */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {application?.approvals?.map((ap: any) => {
                const isPaused = ap.status === 'QUERY_RAISED';
                const isApproved = ap.status === 'APPROVED';
                return (
                  <CardSpotlight
                    key={ap.id}
                    spotlightColor="rgba(42, 71, 201, 0.08)"
                    className="p-4 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-lg bg-[var(--primary-50)] text-[var(--primary-600)] font-bold text-xs flex items-center justify-center border border-[var(--primary-200)]">
                          {ap.department?.code}
                        </span>
                        <StatusPill status={ap.status} />
                      </div>

                      <div>
                        <div className="font-semibold text-xs text-[var(--text)] line-clamp-1">
                          {ap.approvalMaster?.name}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">
                          {ap.department?.name}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--border)]">
                      <SLAClock dueDate={ap.dueDate} size="sm" isPaused={isPaused} />
                    </div>
                  </CardSpotlight>
                );
              })}
            </div>

            {/* Stage 2 Locked Approvals Preview */}
            <div className="surface-card p-5 space-y-3">
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                <span>Pre-Operation Clearances (Unlocks Post-Construction)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] opacity-75 text-xs space-y-1">
                  <div className="font-semibold text-[var(--text)]">MPCB Consent to Operate (CTO)</div>
                  <div className="text-[10px] text-[var(--text-subtle)]">Unlocks after CTE + ETP Trial</div>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] opacity-75 text-xs space-y-1">
                  <div className="font-semibold text-[var(--text)]">Factory License (DISH)</div>
                  <div className="text-[10px] text-[var(--text-subtle)]">Unlocks after Building Completion</div>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] opacity-75 text-xs space-y-1">
                  <div className="font-semibold text-[var(--text)]">Final Fire Safety NOC</div>
                  <div className="text-[10px] text-[var(--text-subtle)]">Unlocks after Joint Inspection</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENTS */}
        {activeTab === 'DOCUMENTS' && (
          <div className="surface-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">Attached Statutory Documents</h3>
                <p className="text-xs text-[var(--text-muted)]">Verified across all 4 departments with single upload.</p>
              </div>
              <Button size="sm" variant="outline" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                Upload Replacement
              </Button>
            </div>

            <div className="space-y-2">
              {uploadedDocs.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileCheck className="w-5 h-5 text-[#12B76A] shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-[var(--text)] truncate">{doc.docName}</div>
                      <div className="text-[10px] text-[var(--text-subtle)] font-mono">
                        {doc.docCode} · {doc.fileSize}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[var(--success-text)] bg-[var(--success-bg)] px-2 py-0.5 rounded-full border border-[#A6F4C5]">
                      Verified by Engine
                    </span>
                    <button
                      type="button"
                      className="text-xs text-[var(--primary-600)] hover:underline font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUERIES */}
        {activeTab === 'QUERIES' && (
          <div className="surface-card p-5 space-y-4">
            <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">Official Requisition & Query Threads</h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Replying to a query automatically resumes the statutory RTS SLA clock.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {queries.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[var(--text)]">{q.department} Requisition Notice</span>
                    <StatusPill status={q.status === 'REPLIED' ? 'APPROVED' : 'QUERY_RAISED'} />
                  </div>

                  <p className="text-xs text-[var(--text)] leading-relaxed bg-[var(--surface)] p-3 rounded-lg border border-[var(--border)]">
                    &ldquo;{q.queryText}&rdquo;
                  </p>

                  {q.status === 'REPLIED' ? (
                    <div className="p-3 rounded-lg bg-[var(--success-bg)] border border-[#A6F4C5] text-xs text-[var(--success-text)] space-y-1">
                      <div className="font-semibold">Your Response Dispatched:</div>
                      <div>{q.replyText}</div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type formal clarification, attach rectified document number, or confirm dimensions..."
                        className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          disabled={!replyText.trim() || isSubmittingReply}
                          loading={isSubmittingReply}
                          onClick={() => handleReplyQuery(q.id)}
                          rightIcon={<Send className="w-3.5 h-3.5" />}
                        >
                          Submit Formal Response & Resume SLA
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE (Aceternity Tracing Timeline with Spring Motion) */}
        {activeTab === 'TIMELINE' && (
          <div className="surface-card p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[var(--text)]">Statutory Tracing Timeline</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Dynamic milestone tracking beam certifying exact inter-departmental clearances under Maharashtra Right to Public Services Act 2015.
              </p>
            </div>

            <TracingTimeline
              data={[
                {
                  title: 'MIDC Building Plan Sanctioned',
                  department: 'Special Planning Authority MIDC',
                  status: 'COMPLETED',
                  slaInfo: '2 hours ago · Sanctioned under MRTP Act 1966',
                  content: (
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-700 leading-relaxed font-normal">
                        Architectural blueprint verified compliant with MIDC Building Regulations 2020. Digital sanction certificate issued with cryptographic QR.
                      </p>
                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          Order #SAN-2026-881
                        </span>
                        <span>Verified by Executive Engineer</span>
                      </div>
                    </div>
                  ),
                },
                {
                  title: 'DISH Inspection Query Notice Dispatched',
                  department: 'Directorate of Industrial Safety & Health',
                  status: 'AT_RISK',
                  slaInfo: '4 hours ago · Statutory SLA clock temporarily paused',
                  content: (
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-700 leading-relaxed font-normal">
                        Machine gangway dimension inquiry issued under Section 38 of Factories Act 1948. Awaiting applicant clarification.
                      </p>
                      <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                          Action Required: Requisition #Q-104
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  title: 'Coordinated Joint Inspection Scheduled',
                  department: 'UDYOG MITRA Single Window Cell',
                  status: 'IN_PROGRESS',
                  slaInfo: '1 day ago · Multi-department synchronized slot',
                  content: (
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-700 leading-relaxed font-normal">
                        Consolidated field inspection date set for 5th October with MPCB Environmental Engineer, DISH Safety Inspector, and Fire Station Officer.
                      </p>
                      <div className="text-[10px] text-blue-700 font-medium pt-1">
                        Slot: 11:00 AM IST · Bhosari MIDC Sector 7
                      </div>
                    </div>
                  ),
                },
                {
                  title: 'Common Application Form Dispatched',
                  department: 'Rahul Patil (Applicant)',
                  status: 'COMPLETED',
                  slaInfo: '3 days ago · Simultaneous 30-day statutory clock',
                  content: (
                    <div className="space-y-1.5 text-xs">
                      <p className="text-slate-700 leading-relaxed font-normal">
                        Pre-establishment clearances initiated simultaneously across 4 departments with single unified dossier upload.
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </main>
    </div>
  );
}
