'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import {
  Building2,
  Factory,
  MapPin,
  Coins,
  Zap,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Layers,
  Clock,
  FileText,
  HelpCircle,
  Check,
  ChevronRight,
  MousePointer,
  Briefcase,
  Store,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DotPattern } from '@/components/ui/aceternity';

export default function EntrepreneurOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Profile Form State
  const [profile, setProfile] = useState({
    // 1. Entity
    entityType: 'PRIVATE_LIMITED',
    udyamNo: 'UDYAM-MH-27-0001234',
    panNo: 'ABCPS1234D',
    gstNo: '27ABCPS1234D1ZX',

    // 2. Stage
    businessStage: 'PRE_ESTABLISHMENT', // PRE_ESTABLISHMENT | ESTABLISHMENT | EXPANSION

    // 3. Sector & Pollution
    sector: 'MANUFACTURING',
    subSector: 'FOOD_PROCESSING',
    product: 'Ready-to-Eat Processed Snacks & Dairy Products',
    pollutionCategory: 'ORANGE', // WHITE | GREEN | ORANGE | RED

    // 4. Location
    district: 'Pune',
    taluka: 'Haveli',
    locationType: 'MIDC', // MIDC | NON_MIDC_INDUSTRIAL | SEZ

    // 5. Land
    landOwnership: 'MIDC_ALLOTTED',
    plotAreaSqM: 3000,
    builtUpAreaSqM: 1800,
    buildingHeightM: 12,

    // 6. Investment & Scale
    investmentPlantMachineryLakhs: 200, // ₹2 Cr
    investmentBuildingLakhs: 250,
    employeeCount: 50,
    contractLabourCount: 25,

    // 7. Infra & Triggers
    powerKW: 120,
    waterKLD: 20,
    hasHazardousChemicals: false,
    hasBoiler: false,

    // 8. Social Profile
    isWomenEntrepreneur: false,
    isSCST: false,
    isFirstGeneration: true,
  });

  const [pollutionWarning, setPollutionWarning] = useState('');

  // Auto-suggest pollution category based on subSector
  useEffect(() => {
    if (profile.subSector === 'FOOD_PROCESSING') {
      setProfile((prev) => ({ ...prev, pollutionCategory: 'ORANGE' }));
    } else if (profile.subSector === 'CHEMICAL' || profile.subSector === 'PHARMA') {
      setProfile((prev) => ({ ...prev, pollutionCategory: 'RED' }));
    } else if (profile.subSector === 'IT_SOFTWARE') {
      setProfile((prev) => ({ ...prev, pollutionCategory: 'WHITE' }));
    }
  }, [profile.subSector]);

  const handlePollutionChange = (newCat: string) => {
    setProfile((prev) => ({ ...prev, pollutionCategory: newCat }));
    if (profile.subSector === 'FOOD_PROCESSING' && newCat !== 'ORANGE') {
      setPollutionWarning(
        'Auto-suggested category for Food Processing is ORANGE. Incorrect classification may lead to MPCB scrutiny delay or rejection.'
      );
    } else {
      setPollutionWarning('');
    }
  };

  const steps = [
    { id: 1, title: 'Project Stage', subtitle: 'What operational stage is your industrial setup currently in?' },
    { id: 2, title: 'Legal Constitution', subtitle: 'Select the legal registration type of your manufacturing enterprise.' },
    { id: 3, title: 'Sector & Pollution', subtitle: 'Environmental classification dictates CPCB/MPCB consent scrutiny timelines.' },
    { id: 4, title: 'Location & Zone', subtitle: 'Zoning determines NA conversion exemptions and planning authorities.' },
    { id: 5, title: 'Land & Premises', subtitle: 'Building footprint and height trigger Fire NOC & DISH Factory layout rules.' },
    { id: 6, title: 'Investment & Scale', subtitle: 'Investment determines Package Scheme of Incentives (PSI 2024) subsidies.' },
    { id: 7, title: 'Utilities & Triggers', subtitle: 'High-tension power & hazardous storage dictate joint inspection requirements.' },
    { id: 8, title: 'Subsidies & Confirmation', subtitle: 'Special social category incentives and final statutory roadmap deduction.' },
  ];

  // Enter key progresses step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !['TEXTAREA', 'INPUT'].includes((e.target as HTMLElement).tagName)) {
        if (currentStep < steps.length) {
          e.preventDefault();
          setCurrentStep((prev) => prev + 1);
        } else if (currentStep === steps.length) {
          handleFinishOnboarding();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const handleFinishOnboarding = () => {
    localStorage.setItem('udyog_marg_smart_profile', JSON.stringify(profile));
    router.push('/entrepreneur/checklist');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-indigo-100/60 text-slate-900 flex flex-col selection:bg-purple-100 selection:text-purple-900">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        
        {/* =========================================================================
            CENTERED MODAL CONTAINER (Signature Reference Geometry & Elevation)
            ========================================================================= */}
        <div className="w-full bg-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-[0_30px_70px_-15px_rgba(99,102,241,0.18)] border border-indigo-100/80 flex flex-col justify-between space-y-8 relative overflow-hidden">
          {/* Subtle Aceternity Dot Background */}
          <DotPattern
            width={24}
            height={24}
            cx={2}
            cy={2}
            cr={1}
            className="opacity-25"
          />

          {/* Header Section (Centered Eyebrow, Question, Subtitle matching Reference) */}
          <div className="text-center space-y-2 max-w-xl mx-auto relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#6366F1] block">
              Onboarding · Step {currentStep} of {steps.length}
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {steps[currentStep - 1].subtitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              Select your operating parameters to deduce statutory RTS approvals & eligible subsidies.
            </p>
          </div>

          {/* =========================================================================
              CARD SELECTION GRID (Core 3-Card Interactive Element from Reference)
              ========================================================================= */}
          <div className="py-2 relative z-10">
            
            {/* STEP 1: BUSINESS STAGE (3 Cards matching reference layout) */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'PRE_ESTABLISHMENT',
                    title: 'Pre-Establishment (Greenfield)',
                    desc: 'Initial site setup, building plan approval, CTE, and provisional NOCs.',
                    icon: Factory,
                    tag: '30-Day RTS SLA',
                  },
                  {
                    id: 'ESTABLISHMENT',
                    title: 'Under Construction',
                    desc: 'Site works underway; readying for Consent to Operate (CTO) & Factory Licensing.',
                    icon: Building2,
                    tag: 'CTO & Power',
                  },
                  {
                    id: 'EXPANSION',
                    title: 'Brownfield Expansion',
                    desc: 'Existing unit adding plant capacity or extra shed > 25% requires amendment CTE.',
                    icon: Layers,
                    tag: 'Capacity Addition',
                  },
                ].map((stg) => {
                  const Icon = stg.icon;
                  const isSelected = profile.businessStage === stg.id;
                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, businessStage: stg.id })}
                      className={cn(
                        'rounded-3xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col justify-between items-center space-y-6 relative group select-none',
                        isSelected
                          ? 'ring-2 ring-[#6366F1] border-[#6366F1] bg-indigo-50/50 shadow-lg scale-[1.02]'
                          : 'border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md'
                      )}
                    >
                      {/* Top Vector/Icon Box */}
                      <div className={cn(
                        'w-full h-44 rounded-2xl flex flex-col items-center justify-center p-4 transition-colors relative overflow-hidden',
                        isSelected ? 'bg-indigo-100/70 text-[#6366F1]' : 'bg-[#F5F3FF] text-slate-600 group-hover:bg-indigo-50/60'
                      )}>
                        <Icon className="w-12 h-12 stroke-[1.8] mb-2" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-white/80 px-2.5 py-1 rounded-full border border-indigo-200/80 shadow-2xs">
                          {stg.tag}
                        </span>
                      </div>

                      {/* Title & Desc */}
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#6366F1] transition-colors">
                          {stg.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {stg.desc}
                        </p>
                      </div>

                      {/* Floating Cursor/Selected Badge matching reference image */}
                      {isSelected && (
                        <div className="absolute -bottom-2 right-4 bg-[#6366F1] text-white p-1.5 rounded-full shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 2: LEGAL CONSTITUTION (3 Cards Grid) */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'PRIVATE_LIMITED',
                    title: 'Private Limited Co.',
                    desc: 'Registered under Companies Act 2013 with ROC Maharashtra.',
                    icon: Building2,
                  },
                  {
                    id: 'LIMITED_LIABILITY_PARTNERSHIP',
                    title: 'LLP Partnership',
                    desc: 'LLP registered with MCA with designated active partners.',
                    icon: Briefcase,
                  },
                  {
                    id: 'PROPRIETORSHIP',
                    title: 'Sole Proprietorship',
                    desc: 'Individual owned business registered via Gumasta/Shop Act.',
                    icon: Store,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = profile.entityType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, entityType: opt.id })}
                      className={cn(
                        'rounded-3xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col justify-between items-center space-y-6 relative group select-none',
                        isSelected
                          ? 'ring-2 ring-[#6366F1] border-[#6366F1] bg-indigo-50/50 shadow-lg scale-[1.02]'
                          : 'border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md'
                      )}
                    >
                      <div className={cn(
                        'w-full h-44 rounded-2xl flex flex-col items-center justify-center p-4 transition-colors',
                        isSelected ? 'bg-indigo-100/70 text-[#6366F1]' : 'bg-[#F5F3FF] text-slate-600 group-hover:bg-indigo-50/60'
                      )}>
                        <Icon className="w-12 h-12 stroke-[1.8]" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#6366F1] transition-colors">
                          {opt.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute -bottom-2 right-4 bg-[#6366F1] text-white p-1.5 rounded-full shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 3: SECTOR & POLLUTION CATEGORY (3 Cards Grid) */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    cat: 'GREEN',
                    title: 'Green Tier',
                    desc: 'Low pollution footprint (Score 21-40). 15-day deemed RTS consent.',
                    tag: '15-Day SLA',
                    icon: ShieldCheck,
                  },
                  {
                    cat: 'ORANGE',
                    title: 'Orange Tier',
                    desc: 'Moderate effluent (Score 41-59). Food processing & agro units.',
                    tag: '30-Day SLA',
                    icon: Sparkles,
                  },
                  {
                    cat: 'RED',
                    title: 'Red Tier',
                    desc: 'High environmental impact (Score ≥ 60). Joint inspection mandatory.',
                    tag: '45-Day SLA',
                    icon: AlertTriangle,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = profile.pollutionCategory === item.cat;
                  return (
                    <button
                      key={item.cat}
                      type="button"
                      onClick={() => handlePollutionChange(item.cat)}
                      className={cn(
                        'rounded-3xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col justify-between items-center space-y-6 relative group select-none',
                        isSelected
                          ? 'ring-2 ring-[#6366F1] border-[#6366F1] bg-indigo-50/50 shadow-lg scale-[1.02]'
                          : 'border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md'
                      )}
                    >
                      <div className={cn(
                        'w-full h-44 rounded-2xl flex flex-col items-center justify-center p-4 transition-colors relative',
                        isSelected ? 'bg-indigo-100/70 text-[#6366F1]' : 'bg-[#F5F3FF] text-slate-600 group-hover:bg-indigo-50/60'
                      )}>
                        <Icon className="w-12 h-12 stroke-[1.8] mb-2" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-white/80 px-2.5 py-1 rounded-full border border-indigo-200/80 shadow-2xs">
                          {item.tag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#6366F1] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute -bottom-2 right-4 bg-[#6366F1] text-white p-1.5 rounded-full shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEP 4: LOCATION & INDUSTRIAL ZONE (3 Cards Grid) */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'MIDC',
                    title: 'MIDC Zone',
                    desc: 'Chakan, Bhosari, Butibori, Shendra. Single window MIDC SPA building sanction.',
                    tag: 'No Revenue NA Needed',
                    icon: MapPin,
                  },
                  {
                    id: 'NON_MIDC_INDUSTRIAL',
                    title: 'Non-MIDC Private Land',
                    desc: 'Private freehold land requiring Collector NA & Town Planning sanctions.',
                    tag: 'Collector Approval',
                    icon: Compass,
                  },
                  {
                    id: 'SEZ',
                    title: 'SEZ / Logistics Park',
                    desc: 'Special Economic Zone & Master Layout pre-sanctioned park.',
                    tag: 'Customs Regime',
                    icon: Building2,
                  },
                ].map((loc) => {
                  const Icon = loc.icon;
                  const isSelected = profile.locationType === loc.id;
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, locationType: loc.id })}
                      className={cn(
                        'rounded-3xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col justify-between items-center space-y-6 relative group select-none',
                        isSelected
                          ? 'ring-2 ring-[#6366F1] border-[#6366F1] bg-indigo-50/50 shadow-lg scale-[1.02]'
                          : 'border border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-md'
                      )}
                    >
                      <div className={cn(
                        'w-full h-44 rounded-2xl flex flex-col items-center justify-center p-4 transition-colors relative',
                        isSelected ? 'bg-indigo-100/70 text-[#6366F1]' : 'bg-[#F5F3FF] text-slate-600 group-hover:bg-indigo-50/60'
                      )}>
                        <Icon className="w-12 h-12 stroke-[1.8] mb-2" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700 bg-white/80 px-2.5 py-1 rounded-full border border-indigo-200/80 shadow-2xs">
                          {loc.tag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#6366F1] transition-colors">
                          {loc.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-normal leading-relaxed">
                          {loc.desc}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="absolute -bottom-2 right-4 bg-[#6366F1] text-white p-1.5 rounded-full shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* STEPS 5-8: ADVANCED PARAMETERS & DETAILS */}
            {currentStep >= 5 && (
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* STEP 5: LAND & AREA */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Land & Building Area Specs</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Plot Area (SqM)</label>
                        <input
                          type="number"
                          value={profile.plotAreaSqM}
                          onChange={(e) => setProfile({ ...profile, plotAreaSqM: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Built-up Area (SqM)</label>
                        <input
                          type="number"
                          value={profile.builtUpAreaSqM}
                          onChange={(e) => setProfile({ ...profile, builtUpAreaSqM: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Peak Height (Metres)</label>
                        <input
                          type="number"
                          value={profile.buildingHeightM}
                          onChange={(e) => setProfile({ ...profile, buildingHeightM: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: INVESTMENT & EMPLOYEES */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Capital Investment & Labor Scale</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Plant & Machinery (₹ Lakhs)</label>
                        <input
                          type="number"
                          value={profile.investmentPlantMachineryLakhs}
                          onChange={(e) => setProfile({ ...profile, investmentPlantMachineryLakhs: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Regular Employees</label>
                        <input
                          type="number"
                          value={profile.employeeCount}
                          onChange={(e) => setProfile({ ...profile, employeeCount: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: UTILITIES */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-slate-900">Power & Utility Triggers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Connected Load (KW)</label>
                        <input
                          type="number"
                          value={profile.powerKW}
                          onChange={(e) => setProfile({ ...profile, powerKW: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">Water Demand (KLD)</label>
                        <input
                          type="number"
                          value={profile.waterKLD}
                          onChange={(e) => setProfile({ ...profile, waterKLD: Number(e.target.value) })}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: SUBSIDIES */}
                {currentStep === 8 && (
                  <div className="space-y-4 text-center py-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Smart Discovery Complete!</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your industrial setup qualifies for <strong>4 Parallel Statutory Clearances</strong> and an estimated <strong>₹42.5 Lakhs</strong> under the Maharashtra Package Scheme of Incentives (PSI 2024).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =========================================================================
              FOOTER NAVIGATION CONTROLS (Exact Pagination & Pill Buttons from Ref)
              ========================================================================= */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 relative z-10">
            
            {/* Left: Step Dots / Pagination Indicators (Matching Ref 7-Dot Style) */}
            <div className="flex items-center gap-2 select-none">
              {steps.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentStep(s.id)}
                  title={`Step ${s.id}: ${s.title}`}
                  className={cn(
                    'transition-all duration-300 rounded-full cursor-pointer',
                    s.id === currentStep
                      ? 'w-6 h-2 bg-[#6366F1]'
                      : s.id < currentStep
                      ? 'w-2 h-2 bg-indigo-300'
                      : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
                  )}
                />
              ))}
            </div>

            {/* Right: Navigation Pill Buttons ("< Back" and "Continue >") */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 disabled:opacity-40 px-6 py-2.5 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>‹ Back</span>
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                  className="rounded-full bg-[#6366F1] hover:bg-[#4F46E5] active:bg-[#4338CA] text-white px-7 py-2.5 text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Approval Roadmap</span>
                  <CheckCircle2 className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
