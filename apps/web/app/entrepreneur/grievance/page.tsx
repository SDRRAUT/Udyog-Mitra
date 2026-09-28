'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Plus,
  ArrowRight,
  ChevronRight,
  Building2,
  FileText,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader } from '@/components/app/PageHeader';
import { SLAClock } from '@/components/app/SLAClock';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

export default function GrievancePage() {
  const [grievances, setGrievances] = useState<any[]>([
    {
      id: 'grv-1',
      ticketNo: 'GRV-MH-2026-PUN-0042',
      department: 'MPCB',
      deptName: 'Maharashtra Pollution Control Board',
      subject: 'Delay in Consent to Establish (CTE) site scrutiny beyond 21 days',
      priority: 'HIGH',
      status: 'UNDER_SCRUTINY',
      escalationLevel: 2, // L2 HOD
      dueDate: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-09-24T10:30:00Z',
      description:
        'Application was submitted on Sept 10th. Site inspection has not been coordinated despite two reminders, and 21 days have elapsed under RTS Act.',
      updates: [
        {
          author: 'System Auto-Escalation Engine',
          role: 'Statutory Bot',
          time: '24 Sep, 10:30 AM',
          text: 'Ticket registered. Statutory 48-hour resolution clock initiated.',
        },
        {
          author: 'Dr. Suresh Deshmukh',
          role: 'SRO Pune (MPCB)',
          time: '25 Sep, 02:15 PM',
          text: 'Joint site inspection slot scheduled for 5th October to complete audit in consolidated visit.',
        },
      ],
    },
    {
      id: 'grv-2',
      ticketNo: 'GRV-MH-2026-PUN-0018',
      department: 'FIRE',
      deptName: 'Maharashtra Fire Services',
      subject: 'Clarification regarding revised hydrant spacing query',
      priority: 'MEDIUM',
      status: 'APPROVED',
      escalationLevel: 1, // L1
      dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-09-18T14:15:00Z',
      description:
        'Officer query requested 30m spacing instead of standard 45m for low-hazard food storage.',
      updates: [
        {
          author: 'Fire Inspector Joshi',
          role: 'Divisional Fire Officer',
          time: '19 Sep, 11:00 AM',
          text: 'Query waived after architectural drawing revision submitted.',
        },
      ],
    },
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string>('grv-1');
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    departmentId: 'MPCB',
    priority: 'HIGH',
    subject: '',
    description: '',
  });

  const selectedTicket = grievances.find((g) => g.id === selectedTicketId) || grievances[0];

  const handleLodgeGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) return;

    setIsSubmitting(true);
    const ticketNo = `GRV-MH-2026-PUN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrv = {
      id: `grv-${Date.now()}`,
      ticketNo,
      department: formData.departmentId,
      deptName: `${formData.departmentId} Clearance Cell`,
      subject: formData.subject,
      priority: formData.priority,
      status: 'UNDER_SCRUTINY',
      escalationLevel: 1,
      dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      description: formData.description,
      updates: [
        {
          author: 'System Auto-Audit',
          role: 'RTS Bot',
          time: 'Just now',
          text: 'Grievance lodged under Section 8 of Maharashtra RTS Act 2015.',
        },
      ],
    };

    setGrievances([newGrv, ...grievances]);
    setSelectedTicketId(newGrv.id);
    setSuccessMsg(`Grievance lodged successfully! Ticket: ${ticketNo}`);
    setShowLodgeModal(false);
    setIsSubmitting(false);
    setFormData({
      departmentId: 'MPCB',
      priority: 'HIGH',
      subject: '',
      description: '',
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    const newUpdate = {
      author: 'Rahul Patil',
      role: 'Applicant',
      time: 'Just now',
      text: replyText,
    };
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === selectedTicket.id ? { ...g, updates: [...g.updates, newUpdate] } : g
      )
    );
    setReplyText('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title="Grievance Redressal & Auto-Escalation"
        description="Statutory appeal mechanism under Section 8 of Maharashtra Right to Public Services Act (RTS 2015). Tickets auto-escalate from L1 to L4 if unresolved."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            RTS Appellate Tribunal
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowLodgeModal(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Lodge Statutory Appeal
          </Button>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[var(--success-bg)] border border-[#A6F4C5] text-xs text-[var(--success-text)] flex items-center justify-between animate-in fade-in">
            <span>{successMsg}</span>
            <button
              type="button"
              onClick={() => setSuccessMsg('')}
              className="text-[var(--success-text)] p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TWO-PANE HELPDESK LAYOUT (Linear / Intercom style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: TICKET LIST (Col 5) */}
          <div className="lg:col-span-5 surface-card p-4 space-y-2 border-[var(--border-strong)]">
            <div className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-wider px-1 pb-1">
              Active Appeals ({grievances.length})
            </div>

            <div className="space-y-2">
              {grievances.map((item) => {
                const isSelected = item.id === selectedTicketId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTicketId(item.id)}
                    className={cn(
                      'p-3.5 rounded-xl border text-left cursor-pointer transition select-none space-y-2',
                      isSelected
                        ? 'border-[var(--primary-600)] bg-[var(--surface-3)] shadow-xs'
                        : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-[var(--text)]">
                        {item.ticketNo}
                      </span>
                      <StatusPill status={item.status} />
                    </div>

                    <div className="text-xs font-medium text-[var(--text)] line-clamp-1">
                      {item.subject}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[var(--text-subtle)] pt-1 border-t border-[var(--border)]">
                      <span>{item.department}</span>
                      <span className="font-mono font-medium text-[var(--warning-text)]">
                        Level L{item.escalationLevel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: TICKET DETAIL & THREAD (Col 7) */}
          {selectedTicket && (
            <div className="lg:col-span-7 surface-card p-6 space-y-6 border-[var(--border-strong)]">
              {/* L1 -> L4 Escalation Stepper Header */}
              <div className="space-y-3 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--text)]">
                    {selectedTicket.ticketNo}
                  </span>
                  <SLAClock dueDate={selectedTicket.dueDate} size="sm" />
                </div>

                <h2 className="text-base font-bold text-[var(--text)]">
                  {selectedTicket.subject}
                </h2>

                {/* 4-Step Escalation Stepper */}
                <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-2">
                  <div className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase">
                    RTS Section 8 Statutory Escalation Level:
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { level: 1, label: 'L1 Officer', role: 'Scrutiny Officer' },
                      { level: 2, label: 'L2 HOD', role: 'Joint Director' },
                      { level: 3, label: 'L3 Secretary', role: 'Principal Secy' },
                      { level: 4, label: 'L4 Chief Secy', role: 'Apex Tribunal' },
                    ].map((st) => {
                      const isActive = selectedTicket.escalationLevel >= st.level;
                      const isCurrent = selectedTicket.escalationLevel === st.level;
                      return (
                        <div
                          key={st.level}
                          className={cn(
                            'p-2 rounded-lg border text-xs transition',
                            isCurrent
                              ? 'border-[var(--primary-600)] bg-[var(--surface)] font-bold text-[var(--primary-600)] shadow-xs'
                              : isActive
                              ? 'border-[#A6F4C5] bg-[var(--success-bg)] text-[var(--success-text)]'
                              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-subtle)] opacity-60'
                          )}
                        >
                          <div className="font-mono text-[11px]">{st.label}</div>
                          <div className="text-[10px] text-[var(--text-subtle)] truncate">{st.role}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="p-3.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed">
                <div className="font-semibold text-[var(--text-muted)] text-[11px] mb-1">
                  Original Requisition:
                </div>
                {selectedTicket.description}
              </div>

              {/* Updates Thread */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Audit Log & Responses
                </div>

                <div className="space-y-2.5">
                  {selectedTicket.updates?.map((u: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-[var(--text)]">
                          {u.author} ({u.role})
                        </span>
                        <span className="font-mono text-[var(--text-subtle)]">{u.time}</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{u.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Add formal rejoinder or evidence document details..."
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    disabled={!replyText.trim()}
                    onClick={handleSendReply}
                    rightIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Post Rejoinder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* LODGE GRIEVANCE MODAL */}
      {showLodgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-backdrop animate-in fade-in-50 duration-150">
          <div
            className="w-full max-w-lg surface-card shadow-[var(--shadow-xl)] border-[var(--border-strong)] overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[var(--text)]">
                  Lodge Statutory RTS Grievance
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Trigger 48-hour statutory resolution SLA under Maharashtra RTS Act.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLodgeModal(false)}
                className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLodgeGrievance} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Department
                  </label>
                  <Select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="MPCB">MPCB (Pollution Control)</option>
                    <option value="DISH">DISH (Industrial Safety)</option>
                    <option value="FIRE">Maharashtra Fire Services</option>
                    <option value="MIDC">MIDC (Planning Authority)</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                    Priority Escalation
                  </label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="HIGH">High (SLA Imminent Breach)</option>
                    <option value="MEDIUM">Medium (General Clarification)</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Subject / Summary of Delay
                </label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Consent to Establish scrutiny delay exceeding 30-day window"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
                  Detailed Grounds of Appeal
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide application number, submission date, and specific officer queries..."
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 text-xs text-[var(--text)] focus:ring-2 focus:ring-[var(--primary-500)] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <Button variant="secondary" size="sm" onClick={() => setShowLodgeModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Submit Appeal to Tribunal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
