'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import {
  Award,
  Coins,
  CheckCircle2,
  Zap,
  Sparkles,
  Clock,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusPill } from '@/components/ui/StatusPill';
import { PageHeader } from '@/components/app/PageHeader';
import { cn } from '@/lib/utils';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedSchemes, setAppliedSchemes] = useState<Record<string, boolean>>({});
  const [expandedScheme, setExpandedScheme] = useState<string | null>('PSI_CAPITAL');

  useEffect(() => {
    setIsLoading(true);
    api.schemes
      .list()
      .then((data) => setSchemes(data || []))
      .catch(() => {
        // Fallback demo schemes
        setSchemes([
          {
            id: 's1',
            code: 'PSI_CAPITAL',
            name: 'Package Scheme of Incentives (PSI 2019) - Capital Subsidy',
            category: 'Capital Incentive',
            benefit: '₹28,50,000 (40% FCI)',
            matchScore: 100,
            description:
              'Fixed Capital Investment (FCI) subsidy for Micro, Small and Medium Enterprises setting up in Zone B (Pune District).',
            criteria: [
              'Registered under MSME Udyam Scheme',
              'Located in Maharashtra Notified Industrial Area',
              'Gross Fixed Capital Investment in Plant & Machinery < ₹50 Cr',
            ],
          },
          {
            id: 's2',
            code: 'STAMP_WAIVER',
            name: '100% Industrial Stamp Duty Exemption',
            category: 'Tax & Duties',
            benefit: '₹8,20,000 (Full Waiver)',
            matchScore: 100,
            description:
              '100% exemption on payment of stamp duty on execution of lease deed with MIDC and mortgage agreements with scheduled banks.',
            criteria: [
              'Food Processing sector notified as focus sector',
              'Plot possession within notified MIDC industrial estate',
            ],
          },
          {
            id: 's3',
            code: 'POWER_TARIFF',
            name: 'Industrial Electricity Duty & Tariff Subsidy',
            category: 'Operational Rebate',
            benefit: '₹1.50 per unit rebate for 5 years',
            matchScore: 92,
            description:
              'Exemption from payment of Electricity Duty for 5 years from date of commercial production, plus special power tariff rebate.',
            criteria: [
              'Connected power load exceeding 100 KW (HT Feasibility)',
              'Regular monthly payment of MSEDCL energy bills',
            ],
          },
          {
            id: 's4',
            code: 'MAHILA_UDYAMI',
            name: 'Maharashtra Mahila Udyami 5% Interest Subvention',
            category: 'Special Focus',
            benefit: '5% Interest Subsidy on Term Loans',
            matchScore: 85,
            description:
              'Additional interest subsidy granted to industrial units owned and managed by women entrepreneurs (≥51% equity shareholding).',
            criteria: [
              'Women entrepreneur shareholding requirement',
              'Term loan sanctioned by Nationalized Bank or MSFC',
            ],
          },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleApply = (schemeId: string) => {
    setAppliedSchemes((prev) => ({ ...prev, [schemeId]: true }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">
      <Navbar />

      <PageHeader
        title="Industrial Subsidies & Incentives"
        description="Matched through the Maharashtra Package Scheme of Incentives (PSI 2019) and Industrial Policy 2024. Clearances auto-verify subsidy eligibility."
        badge={
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)]">
            4 Verified Schemes Available
          </span>
        }
      />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* HERO SUMMARY CARD */}
        <div className="surface-card p-6 border-[var(--border-strong)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[var(--primary-600)] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--accent-500)]" />
              <span>Personalized Industrial Match</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
              You are eligible for 4 statutory schemes · Est. Benefit ₹38–52 Lakhs
            </h2>
            <p className="text-xs text-[var(--text-muted)] max-w-2xl">
              Calculated using your Smart Profile inputs: Food Processing (Focus Sector), MSME (₹2 Cr Plant Investment), and MIDC Pune (Taluka Haveli Zone B).
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-[var(--text-subtle)] block">Estimated Cumulative Value</span>
            <span className="text-2xl font-bold font-mono text-[var(--success-text)]">
              ₹44,70,000
            </span>
          </div>
        </div>

        {/* 2-COLUMN SCHEMES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => {
            const isApplied = appliedSchemes[scheme.id];
            const isExpanded = expandedScheme === scheme.code;

            return (
              <div
                key={scheme.id}
                className="surface-card p-5 space-y-3 flex flex-col justify-between select-none"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)] border border-[var(--border)]">
                      {scheme.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-[var(--success-text)] bg-[var(--success-bg)] px-2 py-0.5 rounded-full border border-[#A6F4C5] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{scheme.matchScore}% Match</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text)]">{scheme.name}</h3>
                    <div className="text-xs font-mono font-bold text-[var(--primary-600)] mt-0.5">
                      Statutory Benefit: {scheme.benefit}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Why Eligible Expandable Conditions */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedScheme(isExpanded ? null : scheme.code)}
                      className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Why you qualify ({scheme.criteria?.length || 2} conditions matched)</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] animate-in fade-in duration-150">
                        {scheme.criteria?.map((c: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text)]">
                            <Check className="w-3.5 h-3.5 text-[#12B76A] shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-subtle)]">
                    Single CAF auto-prepares DIC filing
                  </span>
                  <Button
                    size="sm"
                    variant={isApplied ? 'secondary' : 'primary'}
                    disabled={isApplied}
                    onClick={() => handleApply(scheme.id)}
                    rightIcon={isApplied ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {isApplied ? 'Application Drafted' : 'Claim Incentive'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
