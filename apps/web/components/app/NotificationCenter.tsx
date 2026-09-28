'use client';

import React, { useState } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Check,
  Building2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';

export interface NotificationItem {
  id: string;
  title: string;
  context: string;
  category: 'ALL' | 'ACTION_REQUIRED' | 'MENTIONS';
  timestamp: string | Date;
  read: boolean;
  department?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}: {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTION_REQUIRED' | 'MENTIONS'>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'ALL') return true;
    return n.category === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] surface-card border-[var(--border-strong)] shadow-[var(--shadow-lg)] z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text)]">Notifications</span>
          {unreadCount > 0 && (
            <span className="h-5 px-1.5 rounded-full text-[11px] font-mono font-medium bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs text-[var(--primary-600)] hover:underline font-medium cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2 border-b border-[var(--border)] flex gap-4 text-xs font-medium text-[var(--text-muted)] bg-[var(--surface-2)]">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={cn(
            'pb-2 border-b-2 cursor-pointer transition-colors',
            activeTab === 'ALL'
              ? 'border-[var(--primary-600)] text-[var(--primary-600)] font-semibold'
              : 'border-transparent hover:text-[var(--text)]'
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ACTION_REQUIRED')}
          className={cn(
            'pb-2 border-b-2 cursor-pointer transition-colors',
            activeTab === 'ACTION_REQUIRED'
              ? 'border-[var(--primary-600)] text-[var(--primary-600)] font-semibold'
              : 'border-transparent hover:text-[var(--text)]'
          )}
        >
          Action Required
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('MENTIONS')}
          className={cn(
            'pb-2 border-b-2 cursor-pointer transition-colors',
            activeTab === 'MENTIONS'
              ? 'border-[var(--primary-600)] text-[var(--primary-600)] font-semibold'
              : 'border-transparent hover:text-[var(--text)]'
          )}
        >
          Mentions
        </button>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-subtle)]">
            No notifications in this tab
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={cn(
                'p-3.5 flex items-start gap-3 transition-colors',
                !item.read ? 'bg-[var(--surface-2)]' : 'bg-[var(--surface)] hover:bg-[var(--surface-2)]'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] flex items-center justify-center shrink-0 mt-0.5">
                {item.category === 'ACTION_REQUIRED' ? (
                  <AlertTriangle className="w-4 h-4 text-[var(--warning-text)]" />
                ) : item.department ? (
                  <Building2 className="w-4 h-4 text-[var(--primary-600)]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[var(--accent-500)]" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold text-[var(--text)] truncate">
                    {item.title}
                  </span>
                  {!item.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-600)] shrink-0" />
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {item.context}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-subtle)]">
                  <span>{formatRelativeTime(item.timestamp)}</span>
                  {item.actionLabel && (
                    <a
                      href={item.actionUrl || '#'}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 font-medium text-[var(--primary-600)] hover:underline"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[var(--surface-2)] border-t border-[var(--border)] text-center">
        <a
          href="/notifications"
          onClick={onClose}
          className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          View all notifications & activity log →
        </a>
      </div>
    </div>
  );
}
