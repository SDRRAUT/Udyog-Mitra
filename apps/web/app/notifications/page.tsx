'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import { useSocket } from '@/hooks/useSocket';
import {
  Bell,
  CheckCheck,
  Clock,
  AlertTriangle,
  FileCheck2,
  Calendar,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Filter,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

interface NotificationItem {
  id: string;
  type: 'SLA' | 'QUERY' | 'APPROVAL' | 'INSPECTION' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  link?: string;
  actionText?: string;
}

export default function NotificationsPage() {
  const { on, isConnected } = useSocket();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'SLA' | 'QUERIES'>('ALL');
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'SLA',
      title: 'SLA Escalation Triggered (Level 2)',
      message: 'MPCB Consent to Establish for Rahul Foods (MS-2026-PUN-000123) has reached 24h threshold. Escalated to Department HOD Pune.',
      timestamp: '5 mins ago',
      read: false,
      priority: 'CRITICAL',
      link: '/department/queue',
      actionText: 'View in Priority Queue'
    },
    {
      id: 'notif-2',
      type: 'QUERY',
      title: 'Clarification Requested by MPCB Officer',
      message: 'Officer Shrikant Patil requested scaled site drawings and effluent neutralisation flow for Application MS-2026-PUN-000123.',
      timestamp: '18 mins ago',
      read: false,
      priority: 'HIGH',
      link: '/entrepreneur/application/app-1',
      actionText: 'Reply to Query'
    },
    {
      id: 'notif-3',
      type: 'INSPECTION',
      title: 'Joint Inspection Proposed',
      message: 'MPCB, DISH, and Fire Department proposed a combined single-visit inspection for Tue, 14 Apr at 11:00 AM.',
      timestamp: '1 hour ago',
      read: false,
      priority: 'HIGH',
      link: '/department/inspections',
      actionText: 'Review Joint Schedule'
    },
    {
      id: 'notif-4',
      type: 'APPROVAL',
      title: 'Factory Plan Approval Issued',
      message: 'DISH Maharashtra has sanctioned the factory layout plan under Rule 3-A. Certificate cert-dish-2026-081 ready for download.',
      timestamp: '3 hours ago',
      read: true,
      priority: 'NORMAL',
      link: '/verify/CERT-DISH-2026-081',
      actionText: 'Verify Certificate'
    },
    {
      id: 'notif-5',
      type: 'SYSTEM',
      title: 'New Scheme Eligibility Detected',
      message: 'Based on your updated capital investment (₹2.00 Cr), your unit qualifies for 100% Stamp Duty Exemption under PSI 2019.',
      timestamp: '1 day ago',
      read: true,
      priority: 'NORMAL',
      link: '/entrepreneur/schemes',
      actionText: 'View Scheme Details'
    }
  ]);

  useEffect(() => {
    const handleNewNotif = (notif: any) => {
      setNotifications(prev => [
        {
          id: `live-${Date.now()}`,
          type: notif.type || 'SYSTEM',
          title: notif.title || 'Live Regulatory Alert',
          message: notif.body || notif.message || 'Notification received from UDYOG MITRA backend.',
          timestamp: 'Just now',
          read: false,
          priority: notif.priority || 'HIGH',
          link: notif.link || '/entrepreneur/dashboard',
          actionText: 'View Details'
        },
        ...prev
      ]);
    };

    on('notification_new', handleNewNotif);
    on('sla_breach', (data: any) => {
      handleNewNotif({
        type: 'SLA',
        title: 'Statutory SLA Breach Alert',
        body: `Application ${data?.applicationId || ''} breached SLA deadline. Auto-escalated under RTS Act 2015.`,
        priority: 'CRITICAL',
        link: '/department/queue'
      });
    });
  }, [on]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'SLA') return n.type === 'SLA';
    if (activeFilter === 'QUERIES') return n.type === 'QUERY';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Notification Center
                  {unreadCount > 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </h1>
                <p className="text-sm text-slate-400">
                  Real-time statutory updates, query tickets, inspection alerts & auto-escalations
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-sm transition"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg text-sm transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-800/80 pb-3">
          <Filter className="w-4 h-4 text-slate-500 mr-2" />
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'SLA', label: 'Statutory SLA' },
            { id: 'QUERIES', label: 'Queries' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition ${
                activeFilter === tab.id
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="mt-6 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/30 border border-slate-800/80 rounded-2xl">
              <CheckCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-slate-300">All caught up!</h3>
              <p className="text-sm text-slate-500 mt-1">No notifications match your current filter.</p>
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/70 text-slate-300'
                    : 'bg-slate-900/90 border-orange-500/40 shadow-sm shadow-orange-500/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {item.type === 'SLA' && (
                      <div className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                    {item.type === 'QUERY' && (
                      <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    )}
                    {item.type === 'INSPECTION' && (
                      <div className="p-2 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                    )}
                    {item.type === 'APPROVAL' && (
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg">
                        <FileCheck2 className="w-5 h-5" />
                      </div>
                    )}
                    {item.type === 'SYSTEM' && (
                      <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-semibold ${item.read ? 'text-slate-200' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        )}
                        {item.priority === 'CRITICAL' && (
                          <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded">
                            Critical SLA
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {item.link && (
                      <div className="mt-3 flex items-center justify-between">
                        <Link
                          href={item.link}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
                        >
                          {item.actionText || 'View Details'}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
