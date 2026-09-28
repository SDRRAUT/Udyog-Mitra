'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  HelpCircle,
  BookOpen,
  Scale,
  FileText,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Bot,
  ShieldCheck,
  Building,
  PhoneCall,
  Mail,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the Maharashtra Right to Public Services Act (RTS 2015) guarantee?',
      a: 'Under the RTS Act 2015, all notified industrial clearances have a statutory time-bound limit (typically 30 calendar days). If a department officer fails to act within the prescribed SLA without statutory justification, the application automatically escalates through a multi-tier hierarchy (L2 HOD -> L3 DIC -> L4 State Admin) and is subject to deemed approval and officer penalty clauses.',
    },
    {
      q: 'What is the "Approvals Find You" inverse logic on UDYOG MITRA?',
      a: 'Unlike traditional single-window portals where an investor must research which departments to approach, UDYOG MITRA evaluates your 8-step Smart Profile using an automated rule engine. The platform automatically determines mandatory clearances, resolves inter-departmental dependencies, groups parallel workflows, and compresses sequential timelines from 180 days down to 65 days.',
    },
    {
      q: 'What is a Single-Window Joint Inspection?',
      a: 'For industrial units requiring clearances from multiple statutory bodies (such as MPCB for pollution, DISH for industrial safety, and Fire Department for fire NOC), UDYOG MITRA coordinates a unified, single-visit joint inspection. Instead of multiple separate officer visits on different dates, all inspectors visit together on one pre-scheduled date and file a combined inspection report.',
    },
    {
      q: 'How does the Common Application Form (CAF) auto-fill work?',
      a: 'UDYOG MITRA captures promoter, land, and entity details once in the Smart Profile. When clearing applications across MPCB, DISH, Fire, MIDC, and Labour, all shared fields are auto-filled from the single source of truth. Each department only prompts for their specific technical parameters.',
    },
    {
      q: 'What happens if an officer raises a query on my application?',
      a: 'When an officer raises a query, the statutory SLA clock is paused immediately to ensure fairness. You receive an instant SMS and in-app notification. Once you provide the clarification or upload the requested document, the SLA clock resumes from the exact remaining time.',
    },
    {
      q: 'How can I verify the authenticity of an approved certificate?',
      a: 'Every approval issued through UDYOG MITRA contains a secure QR code and a unique certificate number (e.g., CERT-UM-2026-PUN-000123). Anyone (including banks, DIC, or inspectors) can scan the QR code or visit /verify/[certNo] to verify the SHA-256 cryptographic hash and approval validity in real time.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-[var(--primary-100)] selection:text-[var(--primary-900)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-w-0">
        {/* Banner */}
        <div className="p-6 sm:p-8 surface-card border border-[var(--border)] rounded-xl relative overflow-hidden shadow-xs">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 text-xs font-semibold bg-[var(--primary-50)] text-[var(--primary-700)] border border-[var(--primary-200)] rounded-full inline-block mb-3">
              Statutory Support Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
              How can we assist your industrial journey?
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
              Find answers regarding Maharashtra Single Window clearances, RTS Act 2015 guarantees, joint inspections, and scheme incentives.
            </p>

            <div className="mt-5 relative">
              <Search className="w-4 h-4 text-[var(--text-subtle)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clearances, rules, RTS Act, joint inspections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[var(--text)] placeholder:[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
              />
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/entrepreneur/chat"
            className="p-4 sm:p-5 surface-card hover:bg-[var(--surface-2)] border border-[var(--border)] rounded-xl transition group shadow-xs"
          >
            <div className="p-2 bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)] rounded-lg w-fit transition">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text)] mt-3 flex items-center justify-between">
              MAHA-MITRA AI
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Ask bilingual questions grounded in official Acts & Government Resolutions.
            </p>
          </Link>

          <Link
            href="/entrepreneur/checklist"
            className="p-4 sm:p-5 surface-card hover:bg-[var(--surface-2)] border border-[var(--border)] rounded-xl transition group shadow-xs"
          >
            <div className="p-2 bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)] rounded-lg w-fit transition">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text)] mt-3 flex items-center justify-between">
              Dependency Graph
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              View stage separation, parallel clearance paths, and legal source citations.
            </p>
          </Link>

          <Link
            href="/entrepreneur/schemes"
            className="p-4 sm:p-5 surface-card hover:bg-[var(--surface-2)] border border-[var(--border)] rounded-xl transition group shadow-xs"
          >
            <div className="p-2 bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)] rounded-lg w-fit transition">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text)] mt-3 flex items-center justify-between">
              Incentives & Subsidies
              <ExternalLink className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Explore Package Scheme of Incentives (PSI 2019) and stamp duty waivers.
            </p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="mt-8 space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--primary-600)]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-2.5">
            {filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="surface-card border border-[var(--border)] rounded-xl overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] bg-[var(--surface-2)]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
