'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Upload,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader } from '@/components/app/PageHeader';
import { SLAClock } from '@/components/app/SLAClock';
import { cn } from '@/lib/utils';

export default function CompliancePage() {
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [compliances, setCompliances] = useState([
    {
      id: 'cmp-1',
      name: 'Quarterly Factory Safety Committee Meeting Return (Form 27)',
      dept: 'DISH',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days (Due soon)
      group: 'DUE_SOON',
      type: 'FACTORY_SAFETY',
      fastTrack: true,
      docRequired: 'Safety Committee Minutes signed by Factory Manager',
    },
    {
      id: 'cmp-2',
      name: 'Annual Fire Safety Audit & Hydrant Operational Certificate',
      dept: 'Fire Services',
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      group: 'UPCOMING',
      type: 'FIRE_NOC',
      fastTrack: false,
      docRequired: 'Form B Certificate from Licensed Fire Agency',
    },
    {
      id: 'cmp-3',
      name: 'Half-Yearly Labour Welfare Board ECR Contribution',
      dept: 'Labour Dept',
      dueDate: new Date(Date.now() + 64 * 24 * 60 * 60 * 1000).toISOString(),
      group: 'UPCOMING',
      type: 'LABOUR',
      fastTrack: true,
      docRequired: 'Form A-1 Remittance Challan',
    },
    {
      id: 'cmp-4',
      name: 'Consent to Operate (CTO) Annual Environmental Audit (Form V)',
      dept: 'MPCB',
      dueDate: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000).toISOString(),
      group: 'UPCOMING',
      type: 'CTO_RENEWAL',
      fastTrack: true,
      docRequired: 'Environmental Statement Form V with effluent testing report',
    },
  ]);

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const handleMarkComplete = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title="Statutory Compliance & Renewal Calendar"
        description="Continuous compliance tracking under Maharashtra Factories Rules, Water/Air Acts, and Fire Safety Norms. Automated reminders prevent statutory penalties."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success-text)] border border-[#A6F4C5] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Penalty Protection Active</span>
          </span>
        }
        actions={
          <div className="flex items-center p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-xs select-none">
            <button
              type="button"
              onClick={() => setViewMode('LIST')}
              className={cn(
                'px-3 py-1 rounded-md font-medium cursor-pointer transition',
                viewMode === 'LIST'
                  ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              )}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('CALENDAR')}
              className={cn(
                'px-3 py-1 rounded-md font-medium cursor-pointer transition',
                viewMode === 'CALENDAR'
                  ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              )}
            >
              Calendar Grid
            </button>
          </div>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {viewMode === 'LIST' ? (
          <div className="space-y-4">
            {compliances.map((item) => {
              const isDone = completedItems[item.id];
              return (
                <div
                  key={item.id}
                  className="surface-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--primary-600)]">
                        {item.dept}
                      </span>
                      {item.fastTrack && (
                        <span className="text-[10px] font-mono text-[var(--success-text)] bg-[var(--success-bg)] px-1.5 py-0.2 rounded border border-[#A6F4C5] flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>1-Click Fast Track</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-[var(--text)] truncate">
                      {item.name}
                    </h3>
                    <div className="text-xs text-[var(--text-muted)]">
                      Required Filing: {item.docRequired}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <SLAClock dueDate={item.dueDate} size="sm" />

                    <Button
                      size="sm"
                      variant={isDone ? 'secondary' : 'primary'}
                      disabled={isDone}
                      onClick={() => handleMarkComplete(item.id)}
                      leftIcon={isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A]" /> : <Upload className="w-3.5 h-3.5" />}
                    >
                      {isDone ? 'Filed & Logged' : 'File Return'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* CALENDAR MONTH GRID */
          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--text)]">
                October 2026 Statutory Compliance Schedule
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
                  <span>On Track</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                  <span>Due Soon</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="py-1 font-semibold text-[var(--text-muted)]">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const hasDue = d === 5 || d === 15 || d === 30;
                return (
                  <div
                    key={d}
                    className={cn(
                      'h-20 p-2 rounded-lg border text-left flex flex-col justify-between transition',
                      hasDue
                        ? 'border-[var(--primary-300)] bg-[var(--primary-50)]'
                        : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                    )}
                  >
                    <span className="font-mono text-xs font-semibold text-[var(--text)]">{d}</span>
                    {d === 5 && (
                      <span className="text-[10px] font-semibold text-[#7A5AF8] truncate">
                        Joint Audit
                      </span>
                    )}
                    {d === 15 && (
                      <span className="text-[10px] font-semibold text-[var(--warning-text)] truncate">
                        Fire Audit Due
                      </span>
                    )}
                    {d === 30 && (
                      <span className="text-[10px] font-semibold text-[var(--primary-600)] truncate">
                        MPCB Return
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
