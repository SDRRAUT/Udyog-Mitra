'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useSocket } from '@/hooks/useSocket';
import { api } from '@/lib/api';
import {
  Building2,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronDown,
  User,
  Search,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import { LiveIndicator } from '@/components/app/LiveIndicator';
import { LanguageSwitcher } from '@/components/app/LanguageSwitcher';
import { CommandPalette } from '@/components/app/CommandPalette';
import { NotificationCenter, NotificationItem } from '@/components/app/NotificationCenter';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const { on, isConnected } = useSocket();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Keyboard shortcut listener: ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load unread notifications
  useEffect(() => {
    if (isAuthenticated && !pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
      api.notifications
        .list({ unreadOnly: 'true' })
        .then((res: any) => {
          if (res?.data) {
            const mapped: NotificationItem[] = res.data.map((d: any) => ({
              id: d.id || `notif-${Math.random()}`,
              title: d.title || 'Clearance Update',
              context: d.message || d.context || 'Your application timeline was updated.',
              category: d.type === 'QUERY' ? 'ACTION_REQUIRED' : 'ALL',
              timestamp: d.createdAt || new Date(),
              read: !!d.read,
              department: d.department,
              actionUrl: d.actionUrl || '/entrepreneur/checklist',
              actionLabel: d.actionLabel || 'View',
            }));
            setNotifications(mapped);
            setUnreadCount(res.unreadCount || mapped.length);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  // Real-time socket notification listener
  useEffect(() => {
    const unsub = on('notification', (notif: any) => {
      const newItem: NotificationItem = {
        id: notif.id || `notif-${Date.now()}`,
        title: notif.title || 'New Update',
        context: notif.message || notif.context || 'Application status updated.',
        category: notif.type === 'QUERY' ? 'ACTION_REQUIRED' : 'ALL',
        timestamp: new Date(),
        read: false,
        department: notif.department,
        actionUrl: notif.actionUrl || '/entrepreneur/checklist',
        actionLabel: notif.actionLabel || 'View',
      };
      setNotifications((prev) => [newItem, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      unsub?.();
    };
  }, [on]);

  const handleDemoSwitch = async (email: string, targetPath: string) => {
    try {
      await api.auth.sendOTP(email);
      const res = await api.auth.verifyOTP(email, '123456');
      if (res?.accessToken && res?.user) {
        login(res.user, res.accessToken);
        setShowDemoMenu(false);
        router.push(targetPath);
      }
    } catch (err) {
      console.error('Demo switch error:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Nav Items modeled after Arcode clean style
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Entrepreneur', href: '/entrepreneur/dashboard' },
    { label: 'Checklist', href: '/entrepreneur/checklist' },
    { label: 'Departments', href: '/department/queue' },
    { label: 'Command', href: '/admin' },
    { label: 'Public RTI', href: '/public/transparency' },
  ];

  return (
    <>
      {/* Top Maha Govt Official Header Strip - Modern UX4G Trust */}
      <div className="bg-[var(--surface-2)] border-b border-[var(--border)] text-xs px-3 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center text-[var(--text-muted)] select-none w-full min-w-0 overflow-x-hidden">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 truncate">
          <span className="flex items-center font-bold text-[var(--text)] tracking-tight shrink-0">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-500)] inline-block mr-1.5 shrink-0" />
            <span className="hidden sm:inline">GOVERNMENT OF MAHARASHTRA</span>
            <span className="sm:hidden text-[11px]">GoM · UDYOG MITRA</span>
          </span>
          <span className="text-[var(--border-strong)] hidden md:inline">|</span>
          <span className="hidden md:inline text-[var(--text-subtle)] font-medium truncate">
            Industry, Energy & Labour Department (Single Window Portal)
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <LiveIndicator isConnected={isConnected} />
          <LanguageSwitcher />

          {/* Persona Switcher Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="text-[11px] font-semibold bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-3)] px-2.5 py-1 rounded-md border border-[var(--border)] shadow-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Demo Persona</span>
              <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] py-2 z-50 text-left animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-1.5 border-b border-[var(--border)] text-[10px] text-[var(--text-subtle)] font-bold uppercase tracking-wider">
                  Instant Demo Persona Switch
                </div>
                <button
                  onClick={() => handleDemoSwitch('entrepreneur.demo@mahsetu.in', '/entrepreneur/dashboard')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface-2)] flex items-center space-x-2.5 text-[var(--text)] transition cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#6366F1]" />
                  <div>
                    <div className="font-semibold text-[var(--text)]">Rahul Patil (Entrepreneur)</div>
                    <div className="text-[10px] text-[var(--text-subtle)]">Rahul Foods Pvt Ltd, MIDC Pune</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('mpcb.officer@mahsetu.in', '/department/queue')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface-2)] flex items-center space-x-2.5 text-[var(--text)] transition cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-[#12B76A]" />
                  <div>
                    <div className="font-semibold text-[var(--text)]">Dr. Suresh Deshmukh (MPCB Officer)</div>
                    <div className="text-[10px] text-[var(--text-subtle)]">Pollution Control Board, SRO Pune</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('dish.officer@mahsetu.in', '/department/dashboard')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface-2)] flex items-center space-x-2.5 text-[var(--text)] transition cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[var(--accent-500)]" />
                  <div>
                    <div className="font-semibold text-[var(--text)]">Shri. M. R. Patil (DISH HOD)</div>
                    <div className="text-[10px] text-[var(--text-subtle)]">Directorate of Industrial Safety</div>
                  </div>
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin.msis@mahsetu.in', '/admin')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface-2)] flex items-center space-x-2.5 text-[var(--text)] transition border-t border-[var(--border)] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#6366F1]" />
                  <div>
                    <div className="font-semibold text-[var(--text)]">State MSIS Admin (Mantralaya)</div>
                    <div className="text-[10px] text-[var(--text-subtle)]">State Single-Window Command Center</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Modern Navbar (Arcode Inspired Design 01) */}
      <header className="sticky top-0 z-40 w-full transition-all duration-200 px-3 sm:px-6 lg:px-8 py-2.5 pointer-events-none">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_6px_24px_-4px_rgba(15,23,42,0.08)] px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          
          {/* Left: Brand & Logo (Arcode style emblem) */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0 select-none">
            <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center shadow-xs text-[#6366F1] group-hover:scale-105 group-hover:bg-[#6366F1] group-hover:text-white transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 18C6.5 11 10.5 11 12 11C13.5 11 17.5 11 20 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 18V14M12 18V11M16 18V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-[#6366F1] transition-colors">
                UDYOG MITRA
              </span>
              <span className="text-[10px] font-semibold bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 px-2 py-0.5 rounded-full">
                MAHARASHTRA
              </span>
            </div>
          </Link>

          {/* Center: Clean Centered Navigation Links with Underline Active State (Arcode 01) */}
          <nav className="hidden lg:flex flex-1 justify-center items-center space-x-6 xl:space-x-8 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-1 py-1.5 transition-colors ${
                    isActive
                      ? 'text-[#6366F1] font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#6366F1] rounded-full animate-in fade-in zoom-in-75 duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions & Signature Arcode Button */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            {/* Search ⌘K */}
            <button
              type="button"
              onClick={() => setIsCmdOpen(true)}
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-500 transition cursor-pointer shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden xl:inline pr-1">Search</span>
              <span className="text-[10px] font-mono border border-slate-300 px-1 py-0.2 rounded bg-white text-slate-600">⌘K</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200 bg-white cursor-pointer shadow-2xs"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6366F1]" />
                )}
              </button>

              <NotificationCenter
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAllRead={() => {
                  setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                  setUnreadCount(0);
                }}
              />
            </div>

            {/* User Profile / Menu */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1 pl-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                >
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden md:inline">
                    {user?.name || 'Rahul Patil'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 text-[#6366F1] font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-1.5 text-xs space-y-1 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-semibold text-slate-900 truncate">{user?.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                      <div className="text-[10px] font-mono text-[#6366F1] mt-0.5">{user?.role}</div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium transition"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 font-medium transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Signature Arcode Solid Button (01 - Get Started) */}
            <Link
              href={isAuthenticated ? '/applications/new' : '/entrepreneur/onboarding'}
              className="hidden sm:inline-flex items-center justify-center bg-[#6366F1] hover:bg-[#5254E0] active:bg-[#4338CA] text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-xs transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] select-none"
            >
              <span>{isAuthenticated ? 'New Application' : 'Get Started'}</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200 bg-white cursor-pointer shadow-2xs"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="max-w-7xl mx-auto mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.12)] p-4 pointer-events-auto animate-in fade-in-50 slide-in-from-top-2 duration-200 lg:hidden">
            <div className="flex flex-col space-y-1.5 text-sm font-medium">
              {navItems.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                      isActive
                        ? 'bg-[#6366F1]/10 text-[#6366F1] font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  href={isAuthenticated ? '/applications/new' : '/entrepreneur/onboarding'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center bg-[#6366F1] hover:bg-[#5254E0] text-white font-medium text-sm py-2.5 rounded-xl shadow-xs transition"
                >
                  <span>{isAuthenticated ? 'New Application' : 'Get Started'}</span>
                </Link>

                {!isAuthenticated && (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-2 rounded-xl border border-slate-200 bg-slate-50 transition"
                  >
                    Officer / Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
    </>
  );
}
