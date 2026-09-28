'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CardSpotlight, AnimatedTooltip, DotPattern, HoverBorderGradient } from '@/components/ui/aceternity';
import {
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Award,
  Sparkles,
  Play,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Layers,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const [verifyCertNo, setVerifyCertNo] = useState('MH-2026-MPCB-00892');
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyCertNo.trim()) {
      router.push(`/verify/${encodeURIComponent(verifyCertNo.trim())}`);
    }
  };

  const departments = [
    { code: 'MPCB', name: 'Maharashtra Pollution Control Board' },
    { code: 'DISH', name: 'Industrial Safety & Health' },
    { code: 'MIDC', name: 'Industrial Development Corp' },
    { code: 'MAHAFIRE', name: 'Directorate of Fire Services' },
    { code: 'MSEDCL', name: 'State Electricity Distribution' },
    { code: 'LABOUR', name: 'Labour Commissionerate' },
  ];

  const tracks = [
    {
      title: 'Consent to Establish (CTE)',
      category: 'MPCB · Agro & Food Processing',
      sla: '30 Days RTS SLA',
      image: '/card_agro_food.jpg',
      href: '/entrepreneur/onboarding',
      badge: 'Orange Tier',
    },
    {
      title: 'Factory Plan & Safety License',
      category: 'DISH · Precision & Automotive Engg',
      sla: '30 Days RTS SLA',
      image: '/card_auto.jpg',
      href: '/entrepreneur/onboarding',
      badge: 'Safety 1948',
    },
    {
      title: 'Fire Safety NOC & Water Allotment',
      category: 'MAHAFIRE & MIDC · Clean Energy',
      sla: '15 Days RTS SLA',
      image: '/card_clean_energy.jpg',
      href: '/entrepreneur/onboarding',
      badge: 'Fast Track',
    },
  ];

  const handlePrev = () => {
    setActiveTrackIdx((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveTrackIdx((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-16 sm:space-y-24">
        {/* =========================================================================
            SECTION 1: HERO (Large Rounded Banner with Atmospheric Imagery & Cutout)
            ========================================================================= */}
        <section className="relative w-full rounded-[2rem] sm:rounded-[2.75rem] overflow-hidden bg-slate-900 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-200/80 min-h-[560px] lg:min-h-[620px] flex items-center">
          {/* Background Industrial Aerial / Sky Photo */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero_industrial.jpg"
              alt="Maharashtra Modern High-Tech Industrial Park"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center scale-105 transition-transform duration-1000"
            />
            {/* Atmospheric Gradient Layer matching reference sky feeling */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/30 lg:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/40 lg:hidden" />
          </div>

          {/* Hero Content Grid */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column with 3-Step Micro Indicator */}
            <div className="lg:col-span-8 xl:col-span-7 flex gap-4 sm:gap-6 items-start">
              
              {/* Vertical Micro-Step Indicator (1 - 2 - 3 from reference) */}
              <div className="hidden sm:flex flex-col items-center pt-2 select-none shrink-0">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xs font-bold text-[#6366F1]">
                  1
                </div>
                <div className="w-0.5 h-12 bg-slate-300/80 my-1" />
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xs font-bold text-slate-500">
                  2
                </div>
                <div className="w-0.5 h-12 bg-slate-300/80 my-1" />
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-xs font-bold text-slate-500">
                  3
                </div>
              </div>

              {/* Text Block */}
              <div className="space-y-5 sm:space-y-6">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#F5821F]" />
                  <span>START YOUR INDUSTRIAL JOURNEY</span>
                </div>

                {/* Main Headline (Editorial, clean, high-impact) */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                  Experience <br />
                  The Speed Of <br />
                  <span className="text-[#2A47C9] bg-gradient-to-r from-[#2A47C9] to-[#6366F1] bg-clip-text text-transparent">
                    Industrial Clearance!
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg font-normal">
                  Replace 14 disjointed department visits with one AI-orchestrated single window.
                  Statutory parallel clearances and deemed approval under Maharashtra RTS Act 2015.
                </p>

                {/* Action Buttons: Solid Pill + Play Button */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    href="/entrepreneur/onboarding"
                    className="inline-flex items-center justify-center bg-[#2A47C9] hover:bg-[#1E3A8A] active:bg-[#172554] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Check Approvals</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>

                  <Link
                    href="/design-system"
                    className="w-12 h-12 rounded-full bg-white text-[#2A47C9] hover:text-[#1E3A8A] border border-slate-200 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
                    title="Explore Interactive Platform"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5 group-hover:scale-110 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Empty space for the right image on desktop */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-5" />
          </div>

          {/* Floating Cutout Card in Bottom-Right Corner (Signature Reference Element with Aceternity AnimatedTooltip) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
            <Link
              href="/public/transparency"
              className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex items-center gap-3.5 hover:shadow-lg transition-all hover:scale-[1.02] group"
            >
              {/* Aceternity AnimatedTooltip with Interactive Spring Physics */}
              <AnimatedTooltip
                items={[
                  { id: 'pcb', name: 'Maharashtra Pollution Control Board', designation: 'Consent to Establish (CTE)', metric: '30d SLA · 98.6%', badge: 'PCB', color: 'bg-blue-50 text-blue-700' },
                  { id: 'dis', name: 'Directorate of Industrial Safety & Health', designation: 'Factory Plan Approval', metric: '30d SLA · 99.1%', badge: 'DIS', color: 'bg-emerald-50 text-emerald-700' },
                  { id: 'fir', name: 'Directorate of Fire Services', designation: 'Provisional Fire NOC', metric: '15d SLA · 99.4%', badge: 'FIR', color: 'bg-rose-50 text-rose-700' },
                  { id: 'mdc', name: 'Maharashtra Industrial Dev Corp', designation: 'Water & Building Sanctions', metric: '30d SLA · 98.2%', badge: 'MDC', color: 'bg-purple-50 text-purple-700' },
                ]}
              />

              {/* Text Info */}
              <div className="text-left pr-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-[#2A47C9] transition-colors">
                  <span>Know More</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  98.4% SLA Compliance · 14.8d TAT
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: TRUST & DEPARTMENT PARTNER STRIP
            ========================================================================= */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 py-2 px-2 select-none">
          {/* Left Trust Pill */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700">
            <span className="flex text-amber-500">★★★★★</span>
            <span className="text-slate-400">·</span>
            <span>Rated 4.9/5 by 14,000+ Maharashtra Enterprises</span>
          </div>

          {/* Department Monochrome Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-bold text-slate-400 tracking-wide uppercase">
            {departments.map((d) => (
              <span
                key={d.code}
                className="hover:text-slate-900 transition-colors cursor-default"
                title={d.name}
              >
                {d.code}
              </span>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: POPULAR CLEARANCE PATHWAYS (Card Carousel Style)
            ========================================================================= */}
        <section className="space-y-8">
          {/* Section Header with Left Title and Right Nav Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Statutory Pathways
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-normal">
                High-velocity industrial approval pipelines chosen by Maharashtra manufacturing units.
              </p>
            </div>

            {/* Circular Carousel Nav Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs transition cursor-pointer"
                aria-label="Previous pathway"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xs transition cursor-pointer"
                aria-label="Next pathway"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Horizontal Cards with Aceternity CardSpotlight & DotPattern */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            <DotPattern className="opacity-40" />
            {tracks.map((t, idx) => (
              <CardSpotlight
                key={t.title}
                className="group p-0 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <Link
                  href={t.href}
                  className="flex flex-col h-full"
                >
                  {/* Image Banner */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 border border-slate-200/80 shadow-2xs">
                      {t.badge}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2A47C9] transition-colors leading-snug">
                        {t.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{t.category}</p>
                    </div>

                    {/* Bottom Row: SLA Clock & Blue Action Pill */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-[#2A47C9]" />
                        <span>{t.sla}</span>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#2A47C9] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CardSpotlight>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: JOURNEY MADE SIMPLE (3 Cards with Highlighted Center Blue Card)
            ========================================================================= */}
        <section className="space-y-10 text-center">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Journey To Clearances Made Simple!
            </h2>
            <p className="text-sm text-slate-500 font-normal">
              Replacing 14 physical department visits with zero-duplicate unified digital submission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch text-left">
            {/* Step 1: Light Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6366F1]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  1. Smart Profile Discovery
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Answer 8 basic operational parameters. The statutory rule engine calculates exact applicable clearances, pollution tier, and land zoning requirements.
                </p>
              </div>

              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span>Auto-Evaluates 40+ Rules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2: Highlighted Featured Blue Card (Center of the reference) */}
            <div className="bg-[#2A47C9] text-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(42,71,201,0.25)] flex flex-col justify-between space-y-8 relative overflow-hidden group">
              {/* Circular Decorative Cutout in Top Corner */}
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-sm pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  2. Common Application Form
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  Fill common enterprise data once. System synchronizes inputs to MPCB, DISH, Fire, Labour, and Electricity simultaneously with zero duplication.
                </p>
              </div>

              <Link
                href="/applications/new"
                className="relative z-10 inline-flex items-center justify-between bg-white text-[#2A47C9] hover:bg-blue-50 font-semibold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all"
              >
                <span>Launch Common Application</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Step 3: Light Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  3. Parallel Routing & Audit
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Statutory SLA countdowns begin concurrently. Multi-department visits combine into one consolidated joint site inspection under RTS Act 2015.
                </p>
              </div>

              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>RTS Deemed Clearances</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: BOTTOM SPLIT HERO (Real Founder Image + Editorial Copy + CTA)
            ========================================================================= */}
        <section className="bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-200/90 shadow-sm p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Founder Photo with Floating Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[380px] sm:h-[440px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md">
                <Image
                  src="/entrepreneur_founder.jpg"
                  alt="Industrial Founder in Modern Factory"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-top"
                />
              </div>

              {/* Floating Bottom Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200/80 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-[#2A47C9] block">64% Faster TAT</span>
                  <span className="text-[11px] text-slate-500 font-medium">RTS Deemed Legal Guarantee</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 text-[#2A47C9] border border-blue-200 px-2 py-1 rounded-md">
                  Active 2026
                </span>
              </div>
            </div>

            {/* Right: Editorial Typography & Wide CTA Button */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
                <span>STATE INDUSTRIAL VELOCITY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                ACCELERATE YOUR ENTERPRISE WITH UDYOG MITRA
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                No repeated in-person follow-ups, no redundant site visits, and zero uncertainty.
                Join thousands of industrial manufacturers setting up production units across MIDC Chakan,
                Bhosari, Butibori, and DMIC Shendra under the statutory protection of the Maharashtra Right to Public Services Act 2015.
              </p>

              {/* Wide Atmospheric Action Button matching reference */}
              <div className="pt-2">
                <Link
                  href="/entrepreneur/onboarding"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white font-semibold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Start Your Industrial Clearance Today</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: TAMPER-PROOF CERTIFICATE VERIFIER
            ========================================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs max-w-3xl mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2A47C9] flex items-center justify-center mx-auto border border-blue-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Verify Digital Clearance Certificate
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Public tamper-proof validation of approvals issued under Maharashtra RTS Act 2015.
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2.5 max-w-lg mx-auto pt-2">
            <input
              type="text"
              value={verifyCertNo}
              onChange={(e) => setVerifyCertNo(e.target.value)}
              placeholder="e.g. MH-2026-MPCB-00892"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2A47C9] focus:bg-white transition"
            />
            <button
              type="submit"
              className="bg-[#2A47C9] hover:bg-[#1E3A8A] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              Verify Certificate
            </button>
          </form>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

