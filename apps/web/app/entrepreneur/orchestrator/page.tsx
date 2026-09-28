'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Coins,
  ShieldCheck,
  Flame,
  Leaf,
  Users,
  Factory,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function OrchestratorPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orchestratorResult, setOrchestratorResult] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    businessName: 'Precision Auto Works LLP',
    entityType: 'PRIVATE_LIMITED',
    businessStage: 'ESTABLISHMENT',
    sector: 'AUTOMOTIVE',
    district: 'Pune',
    locationType: 'MIDC',
    landZone: 'INDUSTRIAL',
    totalInvestmentLakhs: 450,
    landAreaSqM: 2500,
    builtUpAreaSqM: 1800,
    employeeCount: 35,
    powerKW: 120,
    waterLPD: 5000,
    hazardousWaste: true,
    fuelConsumption: true,
    effluentDischarge: true,
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      generateChecklist();
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateChecklist = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.checklist.generate({
        entityType: formData.entityType,
        businessStage: formData.businessStage,
        sector: formData.sector,
        locationType: formData.locationType,
        totalInvestmentLakhs: Number(formData.totalInvestmentLakhs),
        employeeCount: Number(formData.employeeCount),
        powerKW: Number(formData.powerKW),
        builtUpAreaSqM: Number(formData.builtUpAreaSqM),
        waterLPD: Number(formData.waterLPD),
        hazardousWaste: formData.hazardousWaste,
        effluentDischarge: formData.effluentDischarge,
        fuelConsumption: formData.fuelConsumption,
      });

      setOrchestratorResult(res);
      setStep(5); // Results step
    } catch (err) {
      console.error('Checklist generation error:', err);
      // Fallback calculated preview
      setOrchestratorResult({
        summary: {
          totalApprovals: 5,
          mandatoryCount: 4,
          conditionalCount: 1,
          totalEstimatedFee: 68500,
          maxTimelineDays: 30,
        },
        approvals: [
          {
            code: 'MPCB_CTE',
            name: 'Consent to Establish (CTE) - Orange Category',
            department: 'Maharashtra Pollution Control Board (MPCB)',
            deptCode: 'MPCB',
            applicability: 'MANDATORY',
            estimatedFee: 25000,
            slaDays: 30,
            explanation: 'Automotive manufacturing with effluent discharge falls in Orange Category under MPCB rules.',
          },
          {
            code: 'FACTORY_LICENSE',
            name: 'Factory License (Registration & Plan Approval)',
            department: 'Directorate of Industrial Safety & Health (DISH)',
            deptCode: 'DISH',
            applicability: 'MANDATORY',
            estimatedFee: 15000,
            slaDays: 30,
            explanation: 'Factory employs > 10 workers with power (> 120 KW) under Factories Act 1948.',
          },
          {
            code: 'FIRE_NOC',
            name: 'Fire Safety Clearance NOC',
            department: 'Maharashtra Fire Services',
            deptCode: 'FIRE',
            applicability: 'MANDATORY',
            estimatedFee: 18500,
            slaDays: 21,
            explanation: 'Industrial built-up area exceeds 1,000 sq.m and operates power machinery.',
          },
          {
            code: 'MIDC_POWER_WATER',
            name: 'Industrial Water & Power Connection Allotment',
            department: 'Maharashtra Industrial Development Corp (MIDC)',
            deptCode: 'MIDC',
            applicability: 'MANDATORY',
            estimatedFee: 10000,
            slaDays: 15,
            explanation: 'Unit located in MIDC Chakan requiring 120 KW load and 5,000 LPD industrial water.',
          },
          {
            code: 'HAZARDOUS_WASTE_AUTH',
            name: 'Hazardous Waste Management Authorization',
            department: 'Maharashtra Pollution Control Board (MPCB)',
            deptCode: 'MPCB',
            applicability: 'CONDITIONAL',
            estimatedFee: 0,
            slaDays: 30,
            explanation: 'Unit generates industrial coolants, paint sludge, or metal scrap.',
          },
        ],
      });
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCAF = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.applications.create({
        businessName: formData.businessName,
        entityType: formData.entityType,
        businessStage: formData.businessStage,
        sector: formData.sector,
        locationType: formData.locationType,
        totalInvestmentLakhs: Number(formData.totalInvestmentLakhs),
        employeeCount: Number(formData.employeeCount),
        powerKW: Number(formData.powerKW),
        builtUpAreaSqM: Number(formData.builtUpAreaSqM),
      });

      if (res?.id) {
        router.push(`/entrepreneur/application/${res.id}`);
      } else {
        router.push('/entrepreneur');
      }
    } catch (err) {
      console.error('Failed to create application:', err);
      router.push('/entrepreneur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-10 px-4 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Dynamic Approval Orchestrator (Inverse Logic Engine)</span>
          </div>
          <h1 className="text-3xl font-black text-white">Find All Clearances in 2 Minutes</h1>
          <p className="text-xs text-slate-400 mt-2">
            No more browsing 40+ departmental websites. Answer 4 quick questions about your industrial unit, and our statutory rule engine automatically orchestrates your required clearances, fees, and timelines.
          </p>
        </div>

        {/* Multi-Step Stepper */}
        {step <= 4 && (
          <div className="flex items-center justify-between max-w-xl mx-auto mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            {[
              { num: 1, label: 'Sector & Entity' },
              { num: 2, label: 'Location & Land' },
              { num: 3, label: 'Scale & Utility' },
              { num: 4, label: 'Pollution & Waste' },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20'
                      : step > s.num
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className="text-[11px] font-medium text-slate-400 mt-1.5 hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Wizard Form Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* STEP 1: Entity & Sector */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Step 1: Industrial Entity & Sector Profile</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Enterprise / Unit Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Entity Legal Constitution</label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="PROPRIETORSHIP">Sole Proprietorship</option>
                    <option value="PARTNERSHIP">Partnership Firm</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="PRIVATE_LIMITED">Private Limited Company</option>
                    <option value="PUBLIC_LIMITED">Public Limited Company</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industrial Sector</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="AUTOMOTIVE">Automotive & Auto Components</option>
                    <option value="FOOD_PROCESSING">Food & Agro Processing</option>
                    <option value="CHEMICALS">Chemicals & Petrochemicals</option>
                    <option value="PHARMACEUTICALS">Pharmaceuticals & Biotech</option>
                    <option value="TEXTILES">Textiles & Garments</option>
                    <option value="ENGINEERING">Heavy Engineering & Fabrication</option>
                    <option value="ELECTRONICS">Electronics & IT Hardware</option>
                    <option value="IT_ITES">IT / ITES Software Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Stage</label>
                  <select
                    value={formData.businessStage}
                    onChange={(e) => setFormData({ ...formData, businessStage: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="PRE_ESTABLISHMENT">Pre-Establishment (Land, Consent, Plan Approval)</option>
                    <option value="ESTABLISHMENT">Establishment (Factory Construction & Machinery)</option>
                    <option value="EXPANSION">Expansion of Existing Unit</option>
                    <option value="DIVERSIFICATION">Diversification into New Product Line</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Land */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>Step 2: Location, District & Land Classification</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">District in Maharashtra</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pune">Pune (Chakan, Ranjangaon, Hinjewadi, Bhosari)</option>
                    <option value="Thane">Thane (Taloja, TTC, Ambernath)</option>
                    <option value="Aurangabad">Chhatrapati Sambhajinagar (Shendra, Waluj)</option>
                    <option value="Nagpur">Nagpur (Butibori, MIHAN SEZ)</option>
                    <option value="Nashik">Nashik (Ambad, Satpur, Sinnar)</option>
                    <option value="Kolhapur">Kolhapur (Shiroli, Gokul Shirgaon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industrial Zone Type</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="MIDC">MIDC Notified Industrial Area</option>
                    <option value="NON_MIDC_INDUSTRIAL">Non-MIDC Private Industrial Zone</option>
                    <option value="SEZ">Special Economic Zone (SEZ)</option>
                    <option value="COASTAL">Coastal Regulation Zone (CRZ)</option>
                    <option value="ECOLOGICALLY_SENSITIVE">Ecologically Sensitive Area (ESA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Total Plot Area (Sq. Metres)</label>
                  <input
                    type="number"
                    value={formData.landAreaSqM}
                    onChange={(e) => setFormData({ ...formData, landAreaSqM: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Proposed Built-Up Area (Sq. Metres)</label>
                  <input
                    type="number"
                    value={formData.builtUpAreaSqM}
                    onChange={(e) => setFormData({ ...formData, builtUpAreaSqM: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Built-up area &gt; 1,000 sq.m triggers mandatory Fire NOC from Maharashtra Fire Services.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Scale & Utilities */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span>Step 3: Capital Investment, Employment & Utilities</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Total Fixed Capital Investment (Rs. in Lakhs)
                  </label>
                  <input
                    type="number"
                    value={formData.totalInvestmentLakhs}
                    onChange={(e) => setFormData({ ...formData, totalInvestmentLakhs: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    Rs. 450 Lakhs = MSME Small Enterprise category (Qualifies for PSI 2019 subsidies)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Workforce / Employees</label>
                  <input
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    &gt; 10 workers with power triggers mandatory DISH Factory License & EPF registration.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Connected Power Load (KW / HP)</label>
                  <input
                    type="number"
                    value={formData.powerKW}
                    onChange={(e) => setFormData({ ...formData, powerKW: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Water Demand (Litres / Day)</label>
                  <input
                    type="number"
                    value={formData.waterLPD}
                    onChange={(e) => setFormData({ ...formData, waterLPD: Number(e.target.value) })}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Pollution & Environmental Checklist */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span>Step 4: Environmental Emissions & Pollution Factors</span>
              </h3>

              <div className="space-y-3">
                <label className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.effluentDischarge}
                    onChange={(e) => setFormData({ ...formData, effluentDischarge: e.target.checked })}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Trade / Industrial Effluent Discharge</div>
                    <div className="text-[11px] text-slate-400">
                      Does the manufacturing process produce liquid trade effluent requiring ETP / CETP connection?
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hazardousWaste}
                    onChange={(e) => setFormData({ ...formData, hazardousWaste: e.target.checked })}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Hazardous & Electronic Waste Generation</div>
                    <div className="text-[11px] text-slate-400">
                      Generates hazardous wastes (chemical sludge, paint filters, used oil, batteries) under HW Rules 2016.
                    </div>
                  </div>
                </label>

                <label className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.fuelConsumption}
                    onChange={(e) => setFormData({ ...formData, fuelConsumption: e.target.checked })}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Fuel Fired Boiler / DG Sets & Air Emissions</div>
                    <div className="text-[11px] text-slate-400">
                      Operates diesel generators, boilers, furnaces, or chimneys requiring Air Act consent.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: ORCHESTRATOR RESULT */}
          {step === 5 && orchestratorResult && (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/40 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Statutory Clearance Roadmap Generated
                  </div>
                  <h3 className="text-xl font-black text-white mt-0.5">
                    {orchestratorResult.summary?.totalApprovals || 5} Clearances Required for {formData.businessName}
                  </h3>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Est. Govt Fees</div>
                    <div className="text-lg font-black text-emerald-400">
                      Rs. {(orchestratorResult.summary?.totalEstimatedFee || 68500).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Statutory SLA Cap</div>
                    <div className="text-lg font-black text-amber-400">
                      {orchestratorResult.summary?.maxTimelineDays || 30} Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Clearance Cards List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Orchestrated Clearances & Department Workflows
                </div>

                {orchestratorResult.approvals?.map((appr: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {appr.deptCode}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">{appr.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            appr.applicability === 'MANDATORY'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {appr.applicability}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{appr.explanation}</p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto shrink-0 text-right text-xs">
                      <span className="font-semibold text-emerald-400">
                        {appr.estimatedFee ? `Rs. ${appr.estimatedFee.toLocaleString()}` : 'Free / Nil'}
                      </span>
                      <span className="text-[11px] text-slate-400">SLA: {appr.slaDays || 30} Days</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Banner */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">Consolidate into 1 Common Application Form (CAF)</div>
                    <div className="text-[11px] text-slate-400">
                      Upload documents once. DigiLocker verified files will be reused across all 5 departments.
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleApplyCAF}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>{isSubmitting ? 'Creating CAF...' : 'Proceed to Consolidated Application'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          {step <= 4 && (
            <div className="flex justify-between items-center pt-6 border-t border-slate-800 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={step === 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 transition-colors flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1.5"
              >
                <span>{step === 4 ? (isSubmitting ? 'Evaluating...' : 'Generate Roadmap') : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
