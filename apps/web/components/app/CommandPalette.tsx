'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Kbd } from '@/components/ui/Kbd';
import {
  Search,
  LayoutDashboard,
  FileCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Sparkles,
  Shield,
  Layers,
  HelpCircle,
  X,
  ArrowRight,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: 'Pages' | 'Actions' | 'Applications' | 'Help';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'dash-ent',
      title: 'Entrepreneur Dashboard',
      category: 'Pages',
      icon: <LayoutDashboard className="w-4 h-4 text-[var(--primary-600)]" />,
      shortcut: 'g d',
      action: () => router.push('/entrepreneur/dashboard'),
      keywords: ['dashboard', 'home', 'overview'],
    },
    {
      id: 'onboard',
      title: 'Smart Profile (Find My Approvals)',
      category: 'Pages',
      icon: <Layers className="w-4 h-4 text-[var(--accent-500)]" />,
      action: () => router.push('/entrepreneur/onboarding'),
      keywords: ['wizard', 'profile', 'step', 'onboarding'],
    },
    {
      id: 'checklist',
      title: 'Dynamic Approval Checklist',
      category: 'Pages',
      icon: <FileCheck className="w-4 h-4 text-[#12B76A]" />,
      action: () => router.push('/entrepreneur/checklist'),
      keywords: ['roadmap', 'checklist', 'approvals', 'cte', 'cto'],
    },
    {
      id: 'dept-queue',
      title: 'Department Scrutiny Queue',
      category: 'Pages',
      icon: <Building2 className="w-4 h-4 text-[var(--primary-600)]" />,
      shortcut: 'g q',
      action: () => router.push('/department/queue'),
      keywords: ['queue', 'officer', 'scrutiny', 'mpcb', 'dish'],
    },
    {
      id: 'admin',
      title: 'State Admin Command Center',
      category: 'Pages',
      icon: <Shield className="w-4 h-4 text-[#7A5AF8]" />,
      action: () => router.push('/admin'),
      keywords: ['admin', 'state', 'heatmap', 'kpis'],
    },
    {
      id: 'schemes',
      title: 'Subsidy & Incentives Schemes',
      category: 'Pages',
      icon: <Sparkles className="w-4 h-4 text-[var(--accent-500)]" />,
      action: () => router.push('/entrepreneur/schemes'),
      keywords: ['schemes', 'money', 'psi', 'subsidy'],
    },
    {
      id: 'compliance',
      title: 'Compliance & Renewal Calendar',
      category: 'Pages',
      icon: <Calendar className="w-4 h-4 text-[#2E90FA]" />,
      action: () => router.push('/entrepreneur/compliance'),
      keywords: ['calendar', 'compliance', 'renewals'],
    },
    {
      id: 'grievance',
      title: 'Grievance Redressal (L1-L4)',
      category: 'Pages',
      icon: <AlertTriangle className="w-4 h-4 text-[#F79009]" />,
      action: () => router.push('/entrepreneur/grievances'),
      keywords: ['grievance', 'ticket', 'escalation'],
    },
    {
      id: 'design-system',
      title: 'View UDYOG MITRA Design System Specs',
      category: 'Help',
      icon: <HelpCircle className="w-4 h-4 text-[var(--text-muted)]" />,
      action: () => router.push('/design-system'),
      keywords: ['design', 'tokens', 'system', 'components'],
    },
  ];

  // Filter commands by query
  const filtered = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle keyboard events inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 overlay-backdrop animate-in fade-in-50 duration-150">
      <div
        className="w-full max-w-xl surface-card shadow-[var(--shadow-xl)] overflow-hidden animate-in zoom-in-95 duration-150 border-[var(--border-strong)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[var(--border)] gap-2 bg-[var(--surface)]">
          <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, screen, or application ID..."
            className="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--text-subtle)]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors select-none',
                    isSelected
                      ? 'bg-[var(--surface-3)] text-[var(--text)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]'
                  )}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="shrink-0">{cmd.icon}</span>
                    <span className="truncate text-sm font-normal text-[var(--text)]">
                      {cmd.title}
                    </span>
                    <span className="text-[10px] text-[var(--text-subtle)] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                      {cmd.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {cmd.shortcut && <Kbd>{cmd.shortcut}</Kbd>}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--primary-600)]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[var(--surface-2)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <Kbd>esc</Kbd> Close
            </span>
          </div>
          <span>UDYOG MITRA Command Palette</span>
        </div>
      </div>
    </div>
  );
}
