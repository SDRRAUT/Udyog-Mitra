'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileCheck,
  Building2,
  Calendar,
  AlertTriangle,
  Sparkles,
  Shield,
  Layers,
  Search,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  ExternalLink,
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  Menu,
  X,
} from 'lucide-react';
import { LiveIndicator } from './LiveIndicator';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter, NotificationItem } from './NotificationCenter';
import { Kbd } from '@/components/ui/Kbd';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'primary' | 'warning' | 'neutral';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const { on, isConnected } = useSocket();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'MPCB CTE Scrutiny Assigned',
      context: 'Application #APP-2026-0042 has been assigned to Pune Regional Officer.',
      category: 'ALL',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: false,
      department: 'MPCB',
      actionUrl: '/entrepreneur/checklist',
      actionLabel: 'View Checklist',
    },
    {
      id: 'n2',
      title: 'Action Required: Factory Plan Confirmation',
      context: 'DISH officer requested dimension verification on bay #3 layout.',
      category: 'ACTION_REQUIRED',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      department: 'DISH',
      actionUrl: '/entrepreneur/checklist',
      actionLabel: 'Respond',
    },
  ]);

  // Keyboard shortcut listener: ⌘K / Ctrl+K and "[" to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
      if (e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Socket listener for new notifications
  useEffect(() => {
    const unsub = on('notification', (notif: any) => {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: notif.title || 'New Clearances Update',
          context: notif.message || notif.context || 'Status updated on your application.',
          category: notif.type === 'QUERY' ? 'ACTION_REQUIRED' : 'ALL',
          timestamp: new Date(),
          read: false,
          department: notif.department,
          actionUrl: notif.actionUrl || '/entrepreneur/checklist',
          actionLabel: notif.actionLabel || 'View',
        },
        ...prev,
      ]);
    });
    return () => unsub?.();
  }, [on]);

  // Demo user switch
  const handleDemoSwitch = async (email: string, targetPath: string) => {
    try {
      await api.auth.sendOTP(email);
      const res = await api.auth.verifyOTP(email, '123456');
      if (res?.accessToken && res?.user) {
        login(res.user, res.accessToken);
        setIsDemoMenuOpen(false);
        router.push(targetPath);
      }
    } catch (err) {
      console.error('Demo switch error:', err);
    }
  };

  // Determine role-based navigation sections
  const isOfficer = user?.role === 'OFFICER' || pathname.startsWith('/department');
  const isAdmin = user?.role === 'SUPER_ADMIN' || pathname.startsWith('/admin');

  const entrepreneurNav: NavSection[] = [
    {
      title: 'Industrial Core',
      items: [
        {
          title: 'Overview',
          href: '/entrepreneur/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          title: 'Smart Profile (Wizard)',
          href: '/entrepreneur/onboarding',
          icon: <Layers className="w-4 h-4" />,
        },
        {
          title: 'Approval Roadmap',
          href: '/entrepreneur/checklist',
          icon: <FileCheck className="w-4 h-4" />,
          badge: '6 Active',
          badgeVariant: 'primary',
        },
        {
          title: 'MAHA-MITRA AI Copilot',
          href: '/entrepreneur/chat',
          icon: <Sparkles className="w-4 h-4 text-[var(--accent-500)]" />,
        },
      ],
    },
    {
      title: 'Compliance & Subsidies',
      items: [
        {
          title: 'Incentives & Schemes',
          href: '/entrepreneur/schemes',
          icon: <Sparkles className="w-4 h-4" />,
          badge: '₹42 L',
          badgeVariant: 'neutral',
        },
        {
          title: 'Compliance Calendar',
          href: '/entrepreneur/compliance',
          icon: <Calendar className="w-4 h-4" />,
        },
        {
          title: 'Grievance Redressal',
          href: '/entrepreneur/grievances',
          icon: <AlertTriangle className="w-4 h-4" />,
        },
      ],
    },
  ];

  const officerNav: NavSection[] = [
    {
      title: 'Department Scrutiny',
      items: [
        {
          title: 'Scrutiny Queue',
          href: '/department/queue',
          icon: <Building2 className="w-4 h-4" />,
          badge: '23',
          badgeVariant: 'warning',
        },
        {
          title: 'Joint Inspections',
          href: '/department/inspections',
          icon: <Clock className="w-4 h-4" />,
          badge: '4 Joint',
          badgeVariant: 'neutral',
        },
        {
          title: 'Officer Dashboard',
          href: '/department/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
          title: 'Compliance Reports',
          href: '/department/reports',
          icon: <FileText className="w-4 h-4" />,
        },
      ],
    },
  ];

  const adminNav: NavSection[] = [
    {
      title: 'State Governance',
      items: [
        {
          title: 'Command Center',
          href: '/admin',
          icon: <Shield className="w-4 h-4" />,
        },
        {
          title: 'Bottleneck Heatmap',
          href: '/admin/dashboard',
          icon: <Layers className="w-4 h-4" />,
        },
        {
          title: 'Rule Engine Rules',
          href: '/admin/checklist-rules',
          icon: <FileCheck className="w-4 h-4" />,
        },
        {
          title: 'Department Performance',
          href: '/admin/departments',
          icon: <Building2 className="w-4 h-4" />,
        },
      ],
    },
  ];

  const activeNav = isAdmin ? adminNav : isOfficer ? officerNav : entrepreneurNav;

  // Breadcrumb path parts
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbTitle =
    pathParts.length > 0
      ? pathParts[pathParts.length - 1].replace(/-/g, ' ').toUpperCase()
      : 'PORTAL';

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Top Maha Govt Official Header Strip - Trust-First UX4G */}
      <div className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs px-4 py-1.5 flex justify-between items-center text-[var(--text-muted)] select-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-500)] inline-block" />
            <span className="tracking-tight">GOVERNMENT OF MAHARASHTRA</span>
          </div>
          <span className="text-[var(--border-strong)]">|</span>
          <span className="hidden md:inline text-[11px] text-[var(--text-subtle)]">
            Industry, Energy & Labour Department (UDYOG MITRA Unified Gateway)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-subtle)]">
            <span>RTS Act 2015 Compliant</span>
            <span>·</span>
            <span>Problem ID: 26130</span>
          </div>
          <Link
            href="/design-system"
            className="text-[11px] font-medium text-[var(--primary-600)] hover:underline flex items-center gap-1"
          >
            <span>Design System</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR (Desktop 248px or 64px collapsed) */}
        <aside
          className={cn(
            'hidden lg:flex flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-200 shrink-0 select-none z-30',
            isCollapsed ? 'w-16' : 'w-60'
          )}
        >
          {/* Logo Area */}
          <div className="h-14 px-3.5 border-b border-[var(--border)] flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 overflow-hidden"
              title="UDYOG MITRA Gateway"
            >
              {/* Minimal Bridge Glyph with Saffron dot */}
              <div className="relative w-8 h-8 rounded-lg bg-[var(--primary-50)] border border-[var(--primary-200)] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[var(--primary-600)]">
                  <path
                    d="M3 18C5 12 9 12 12 12C15 12 19 12 21 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path d="M3 18H21" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M7 18V14M12 18V12M17 18V14" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                {/* Brand saffron dot */}
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-500)]" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="text-sm font-semibold tracking-tight text-[var(--text)] leading-tight">
                    UDYOG MITRA
                  </span>
                  <span className="text-[10px] text-[var(--text-subtle)] truncate">
                    Govt. of Maharashtra
                  </span>
                </div>
              )}
            </Link>

            {!isCollapsed && (
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-1 rounded text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                title="Collapse sidebar ([)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {activeNav.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-2.5 text-[10px] font-semibold text-[var(--text-subtle)] uppercase tracking-wider">
                    {sec.title}
                  </div>
                )}
                {sec.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors select-none group',
                        isActive
                          ? 'bg-[var(--surface-3)] text-[var(--text)] font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
                        isCollapsed && 'justify-center px-0'
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      {/* Active Saffron Indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[var(--accent-500)]" />
                      )}

                      <span
                        className={cn(
                          'shrink-0',
                          isActive ? 'text-[var(--primary-600)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text)]'
                        )}
                      >
                        {item.icon}
                      </span>

                      {!isCollapsed && (
                        <>
                          <span className="truncate flex-1">{item.title}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                'text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0',
                                item.badgeVariant === 'primary' && 'bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]',
                                item.badgeVariant === 'warning' && 'bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[#FEDF89]',
                                item.badgeVariant === 'neutral' && 'bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar Area */}
          <div className="p-2 border-t border-[var(--border)] bg-[var(--surface)] space-y-1">
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => setIsCollapsed(false)}
                className="w-full flex items-center justify-center p-2 rounded text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                title="Expand sidebar ([)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-2">
                {/* Role Switcher Demo Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] transition-colors"
                  >
                    <span className="truncate">
                      Demo Role: <span className="font-semibold text-[var(--text)]">{user?.role || 'ENTREPRENEUR'}</span>
                    </span>
                    <span className="text-[10px] text-[var(--accent-500)] font-semibold">Switch</span>
                  </button>

                  {isDemoMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-1 w-full surface-card shadow-[var(--shadow-lg)] p-1 text-xs space-y-0.5 z-50">
                      <button
                        type="button"
                        onClick={() => handleDemoSwitch('rahul.patil@agrofoods.maha.gov.in', '/entrepreneur/dashboard')}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text)]"
                      >
                        Rahul (Entrepreneur)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoSwitch('officer.mpcb@maha.gov.in', '/department/queue')}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text)]"
                      >
                        MPCB Officer (Pune)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoSwitch('officer.dish@maha.gov.in', '/department/queue')}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text)]"
                      >
                        DISH Officer (Safety)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoSwitch('admin.maitri@maha.gov.in', '/admin')}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text)]"
                      >
                        State Admin (Command)
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between px-1 text-[11px] text-[var(--text-subtle)]">
                  <span>Toggle sidebar</span>
                  <Kbd>[</Kbd>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* STICKY TOPBAR (56px, blur, hairline border) */}
          <header className="sticky top-0 z-40 h-14 topbar-blur px-4 sm:px-6 flex items-center justify-between gap-3">
            {/* Left: Mobile hamburger + Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] truncate">
                <Link href="/" className="hover:text-[var(--text)] hidden sm:inline">
                  UDYOG MITRA
                </Link>
                <span className="hidden sm:inline">/</span>
                <span className="font-medium text-[var(--text)] truncate">
                  {breadcrumbTitle}
                </span>
              </div>
            </div>

            {/* Right Controls: ⌘K Search, Live Indicator, Language, Notifications, User Profile */}
            <div className="flex items-center gap-2.5">
              {/* ⌘K Search Button */}
              <button
                type="button"
                onClick={() => setIsCmdOpen(true)}
                className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-xs text-[var(--text-muted)] transition-colors cursor-pointer shadow-xs"
              >
                <Search className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                <span className="pr-4">Search apps, screens...</span>
                <Kbd>⌘K</Kbd>
              </button>

              {/* Real-time Live Indicator */}
              <LiveIndicator isConnected={isConnected} />

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Notification Center Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer border border-[var(--border)] bg-[var(--surface)]"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--primary-600)] ring-2 ring-[var(--surface)]" />
                  )}
                </button>

                <NotificationCenter
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  notifications={notifications}
                  onMarkAllRead={() => {
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                  }}
                />
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] font-semibold text-xs flex items-center justify-center">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-medium text-[var(--text)] max-w-[100px] truncate hidden sm:inline">
                    {user?.name || 'Rahul Patil'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 surface-card shadow-[var(--shadow-lg)] p-1 text-xs space-y-1 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-[var(--border)]">
                      <div className="font-semibold text-[var(--text)] truncate">{user?.name || 'Rahul Patil'}</div>
                      <div className="text-[11px] text-[var(--text-subtle)] truncate">{user?.email || 'rahul.patil@agrofoods.maha.gov.in'}</div>
                      <div className="text-[10px] font-mono text-[var(--primary-600)] mt-0.5">{user?.role || 'ENTREPRENEUR'}</div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text)]"
                    >
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--text)]"
                    >
                      <Bell className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>Activity Log</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        router.push('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded hover:bg-[var(--danger-bg)] text-[var(--danger-text)] cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 overlay-backdrop"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 bg-[var(--surface)] border-r border-[var(--border)] p-4 flex flex-col z-50">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--primary-50)] text-[var(--primary-600)] flex items-center justify-center font-bold text-xs">
                  UM
                </div>
                <span className="font-semibold text-sm">UDYOG MITRA</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded text-[var(--text-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {activeNav.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-[10px] font-semibold text-[var(--text-subtle)] uppercase">
                    {sec.title}
                  </div>
                  {sec.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium',
                        pathname === item.href
                          ? 'bg-[var(--surface-3)] text-[var(--text)] font-semibold'
                          : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]'
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global ⌘K Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </div>
  );
}
