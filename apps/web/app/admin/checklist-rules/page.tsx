'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  Layers,
  Sparkles,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  History,
  Save,
  ArrowRight,
  ShieldCheck,
  Code2
} from 'lucide-react';

export default function AdminChecklistRulesPage() {
  const [ruleVersion, setRuleVersion] = useState('v14.2');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [publishedMsg, setPublishedMsg] = useState('');

  // Sample Rule Builder State
  const [ruleForm, setRuleForm] = useState({
    ruleCode: 'MPCB_CTE_ORANGE_RED_RULE',
    targetApproval: 'MPCB_CTE',
    targetDept: 'MPCB',
    conditionField1: 'pollutionCategory',
    operator1: 'IN',
    value1: 'ORANGE, RED',
    conditionField2: 'businessStage',
    operator2: 'EQUALS',
    value2: 'PRE_ESTABLISHMENT',
    outputApplicability: 'MANDATORY',
    slaDays: 30,
    explanation: 'Water (Prevention and Control of Pollution) Act 1974 §25 and Air Act 1981 require prior Consent to Establish before setting up equipment.',
    legalSource: 'Water Act 1974 §25; Air Act 1981 §21',
  });

  const existingRules = [
    {
      code: 'MPCB_CTE_ORANGE_RED_RULE',
      approval: 'MPCB Consent to Establish (CTE)',
      condition: 'pollutionCategory IN [ORANGE, RED] && stage == PRE_ESTABLISHMENT',
      outcome: 'MANDATORY (30d SLA)',
      version: 'v14.2',
      status: 'ACTIVE',
    },
    {
      code: 'DISH_FACTORY_PLAN_RULE',
      approval: 'Factory Plan Approval (DISH)',
      condition: 'employees >= 10 || sector == MANUFACTURING',
      outcome: 'MANDATORY (30d SLA)',
      version: 'v14.2',
      status: 'ACTIVE',
    },
    {
      code: 'FIRE_PROVISIONAL_NOC_RULE',
      approval: 'Provisional Fire Safety NOC',
      condition: 'buildingHeightM > 15 || hazardous == true || locationType == MIDC',
      outcome: 'CONDITIONAL (15d SLA)',
      version: 'v14.2',
      status: 'ACTIVE',
    },
    {
      code: 'LABOUR_CLRA_REG_RULE',
      approval: 'Contract Labour Registration (CLRA)',
      condition: 'contractLabourCount >= 20',
      outcome: 'MANDATORY (7d SLA)',
      version: 'v14.2',
      status: 'ACTIVE',
    },
  ];

  const handleTestRule = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        testedProfilesCount: 5,
        matchedCount: 4,
        details: [
          { profile: 'Sharma Food (Food Mfg, Pune, Orange, Pre-Est)', matched: true, outcome: 'MANDATORY' },
          { profile: 'Sahyadri Chemicals (Chemical, Pune, Red, Pre-Est)', matched: true, outcome: 'MANDATORY' },
          { profile: 'Tata Technologies (IT Software, Hinjawadi, White)', matched: false, outcome: 'NOT_APPLICABLE' },
          { profile: 'Bajaj Metallurgy (Engineering, Waluj, Orange, Expansion)', matched: false, outcome: 'NOT_APPLICABLE (Stage Mismatch)' },
          { profile: 'Vidarbha Agro Hub (Food, Nagpur, Orange, Pre-Est)', matched: true, outcome: 'MANDATORY' },
        ],
      });
    }, 400);
  };

  const handlePublishRule = () => {
    const nextVer = 'v15.0';
    setRuleVersion(nextVer);
    setPublishedMsg(`Rule Version ${nextVer} successfully published to production! Redis cache invalidated and immutable audit log snapshot recorded.`);
    setTimeout(() => setPublishedMsg(''), 7000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>No-Code Regulatory Governance Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Visual Rule Builder & Versioning Console
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Modify statutory clearance deduction logic on the fly without code deployments. In-flight applications are preserved via immutable snapshots.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Active Engine:</span>
            <span className="font-mono font-bold text-emerald-400">{ruleVersion}</span>
          </div>
        </div>

        {publishedMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{publishedMsg}</span>
          </div>
        )}

        {/* 2-COLUMN: LEFT VISUAL BUILDER, RIGHT SIMULATOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: VISUAL RULE BUILDER (Col 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>Statutory Rule Definition</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">JSONLogic AST Compatible</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Rule Identifier Code</label>
                  <input
                    type="text"
                    value={ruleForm.ruleCode}
                    onChange={(e) => setRuleForm({ ...ruleForm, ruleCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Clearance Module</label>
                  <select
                    value={ruleForm.targetApproval}
                    onChange={(e) => setRuleForm({ ...ruleForm, targetApproval: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="MPCB_CTE">MPCB Consent to Establish (CTE)</option>
                    <option value="MPCB_CTO">MPCB Consent to Operate (CTO)</option>
                    <option value="DISH_PLAN">Factory Plan Approval (DISH)</option>
                    <option value="FIRE_PROV">Provisional Fire Safety NOC</option>
                  </select>
                </div>
              </div>

              {/* IF CONDITIONS BOX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  IF Condition Logic (Rule Triggers)
                </div>

                {/* Condition 1 */}
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={ruleForm.conditionField1}
                    onChange={(e) => setRuleForm({ ...ruleForm, conditionField1: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                  >
                    <option value="pollutionCategory">pollutionCategory</option>
                    <option value="employeeCount">employeeCount</option>
                    <option value="powerKW">powerKW</option>
                    <option value="locationType">locationType</option>
                  </select>
                  <select
                    value={ruleForm.operator1}
                    onChange={(e) => setRuleForm({ ...ruleForm, operator1: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                  >
                    <option value="IN">IN [List]</option>
                    <option value="EQUALS">EQUALS</option>
                    <option value="GREATER_THAN">&gt;=</option>
                  </select>
                  <input
                    type="text"
                    value={ruleForm.value1}
                    onChange={(e) => setRuleForm({ ...ruleForm, value1: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs font-mono"
                  />
                </div>

                <div className="text-center text-[10px] font-bold text-slate-500 font-mono">AND</div>

                {/* Condition 2 */}
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={ruleForm.conditionField2}
                    onChange={(e) => setRuleForm({ ...ruleForm, conditionField2: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                  >
                    <option value="businessStage">businessStage</option>
                    <option value="sector">sector</option>
                    <option value="hazardous">hasHazardousChemicals</option>
                  </select>
                  <select
                    value={ruleForm.operator2}
                    onChange={(e) => setRuleForm({ ...ruleForm, operator2: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                  >
                    <option value="EQUALS">EQUALS</option>
                    <option value="IN">IN [List]</option>
                  </select>
                  <input
                    type="text"
                    value={ruleForm.value2}
                    onChange={(e) => setRuleForm({ ...ruleForm, value2: e.target.value })}
                    className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* THEN OUTPUT BOX */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  THEN Output Outcome
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Applicability Output</label>
                    <select
                      value={ruleForm.outputApplicability}
                      onChange={(e) => setRuleForm({ ...ruleForm, outputApplicability: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs font-bold text-emerald-400"
                    >
                      <option value="MANDATORY">MANDATORY</option>
                      <option value="CONDITIONAL">CONDITIONAL</option>
                      <option value="INFO">INFO ONLY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Statutory RTS SLA Cap (Days)</label>
                    <input
                      type="number"
                      value={ruleForm.slaDays}
                      onChange={(e) => setRuleForm({ ...ruleForm, slaDays: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">"Why Required?" User Explanation</label>
                  <textarea
                    value={ruleForm.explanation}
                    onChange={(e) => setRuleForm({ ...ruleForm, explanation: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Statutory Act & GR Reference</label>
                  <input
                    type="text"
                    value={ruleForm.legalSource}
                    onChange={(e) => setRuleForm({ ...ruleForm, legalSource: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleTestRule}
                  disabled={isTesting}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTesting ? 'Running AST...' : 'Test Against Sample Profiles'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePublishRule}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 text-xs font-black flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish New Rule Version</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: TEST SIMULATION & ACTIVE RULES LIST (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* TEST RESULTS DRAWER */}
            {testResult && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">Rule AST Simulation Output</h4>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {testResult.matchedCount} / {testResult.testedProfilesCount} Matched
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {testResult.details.map((d: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-[11px]"
                    >
                      <span className="text-slate-300 truncate max-w-[70%]">{d.profile}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                          d.matched ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {d.outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE RULES IN PRODUCTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Active Rule Registry ({ruleVersion})</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">4 Rules</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {existingRules.map((rule) => (
                  <div
                    key={rule.code}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-xs">{rule.approval}</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        {rule.outcome}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-900 p-1.5 rounded border border-slate-850">
                      {rule.condition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
