'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Moon,
  Sun,
  Award,
} from 'lucide-react';

export default function Footer() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleStartJourney = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        router.push(`/entrepreneur/onboarding?email=${encodeURIComponent(emailInput.trim())}`);
      }, 600);
    } else {
      router.push('/entrepreneur/onboarding');
    }
  };

  return (
    <footer className="w-full bg-[#F8FAFC] text-slate-900 border-t border-slate-200/90 pt-16 sm:pt-24 pb-8 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* =========================================================================
            PRE-FOOTER CTA: "Start your journey" (Exact Layout & Proportions from Ref)
            ========================================================================= */}
        <div className="relative text-center space-y-6 max-w-2xl mx-auto py-8 sm:py-12">
          {/* Subtle background ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-emerald-50/50 blur-3xl -z-10 rounded-full opacity-70" />

          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400 block">
            Government of Maharashtra · RTS Act 2015
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic text-slate-900 tracking-tight leading-tight">
            Start your journey
          </h2>

          <form onSubmit={handleStartJourney} className="flex items-center justify-center max-w-md mx-auto relative pt-2">
            <div className="relative w-full flex items-center bg-white rounded-full p-1.5 border border-slate-200 shadow-md focus-within:ring-2 focus-within:ring-[#2A47C9] transition-all">
              <input
                type="text"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email or Udyam No..."
                className="w-full bg-transparent px-5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Redirecting...</span>
                  </>
                ) : (
                  <>
                    <span>Join Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            MAIN FOOTER COLUMNS: Left Mission + Right Categorized Links
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-8 border-t border-slate-200/80">
          
          {/* Left Column: Mission & Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                <Loader2 className="w-3 h-3 animate-spin text-indigo-300" />
              </div>
              <span className="font-bold text-sm tracking-tight text-slate-900 uppercase">
                UDYOG MITRA Single Window
              </span>
            </div>

            <p className="text-xl sm:text-2xl font-normal text-slate-700 tracking-tight leading-snug max-w-md">
              UDYOG MITRA is the industrial clearance gateway you’ve been searching for.
            </p>

            <p className="text-xs text-slate-500 max-w-sm font-normal leading-relaxed">
              Replacing 14 physical department visits with zero-duplicate unified digital filing, parallel scrutiny, and deemed approvals under Maharashtra RTS Act 2015.
            </p>
          </div>

          {/* Right Columns: Categorized Link Groups (Matching Ref Typography & Layout) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            
            {/* Useful Links */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                USEFUL
              </h3>
              <ul className="space-y-2.5 text-slate-600 font-medium">
                <li>
                  <Link href="/entrepreneur/onboarding" className="hover:text-slate-900 transition">
                    Smart Profile Wizard
                  </Link>
                </li>
                <li>
                  <Link href="/entrepreneur/checklist" className="hover:text-slate-900 transition">
                    Approval Roadmap
                  </Link>
                </li>
                <li>
                  <Link href="/applications/new" className="hover:text-slate-900 transition">
                    Common Application (CAF)
                  </Link>
                </li>
                <li>
                  <Link href="/entrepreneur/chat" className="hover:text-slate-900 transition flex items-center gap-1">
                    <span>AI Udyog Mitra</span>
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                  </Link>
                </li>
                <li>
                  <Link href="/entrepreneur/schemes" className="hover:text-slate-900 transition">
                    Incentives & Subsidies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Governance */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                LEGAL & GOV
              </h3>
              <ul className="space-y-2.5 text-slate-600 font-medium">
                <li>
                  <Link href="/public/transparency" className="hover:text-slate-900 transition">
                    RTS Act 2015 Portal
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-slate-900 transition">
                    Track Application
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-slate-900 transition">
                    Help & User Guide
                  </Link>
                </li>
                <li>
                  <Link href="/design-system" className="hover:text-slate-900 transition">
                    Design System
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400 cursor-default">WCAG 2.2 AA Compliant</span>
                </li>
              </ul>
            </div>

            {/* Department Portals */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                PORTALS
              </h3>
              <ul className="space-y-2.5 text-slate-600 font-medium">
                <li>
                  <Link href="/login" className="hover:text-slate-900 transition">
                    Portal Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/department/queue" className="hover:text-slate-900 transition">
                    Department Scrutiny Queue
                  </Link>
                </li>
                <li>
                  <Link href="/department/inspections" className="hover:text-slate-900 transition">
                    Joint Inspection Manager
                  </Link>
                </li>
                <li>
                  <Link href="/dic/dashboard" className="hover:text-slate-900 transition">
                    DIC Nodal Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="hover:text-slate-900 transition">
                    State Command Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SIGNATURE REFERENCE ELEMENT: Massive Display Typography ("UDYOG MITRA ©")
            ========================================================================= */}
        <div className="relative pt-6 pb-2 border-t border-slate-200/60 overflow-hidden select-none pointer-events-none">
          <h1 className="text-[13vw] sm:text-[14vw] font-black text-slate-200/65 leading-none tracking-tighter uppercase whitespace-nowrap text-center sm:text-left transition-colors">
            UDYOG MITRA<span className="text-slate-300/80 font-normal">©</span>
          </h1>
        </div>

        {/* =========================================================================
            BOTTOM UTILITY BAR & FLOATING BADGES
            ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-slate-500 font-medium">
          
          {/* Bottom Left Capsule / Floating Status Toggle */}
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All 14 Department Systems Online · 98.4% RTS SLA Adherence</span>
          </div>

          {/* Bottom Right Copyright */}
          <div className="flex items-center gap-4 text-slate-400">
            <span>© 2026 Government of Maharashtra</span>
            <span>·</span>
            <span>Single Window Industrial Clearance Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
