'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export interface RiskFactor {
  label: string;
  weight: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface RiskBadgeProps {
  score: number; // 0 to 100
  level?: 'LOW' | 'MEDIUM' | 'HIGH';
  factors?: RiskFactor[];
  className?: string;
  showHoverCard?: boolean;
}

export function RiskBadge({
  score,
  level,
  factors,
  className,
  showHoverCard = true,
}: RiskBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Compute level if not explicitly provided
  const computedLevel =
    level || (score <= 30 ? 'LOW' : score <= 70 ? 'MEDIUM' : 'HIGH');

  const config = {
    LOW: {
      label: 'Low Risk',
      subtext: 'Fast-Track Eligible',
      bg: 'bg-[#ECFDF3]',
      text: 'text-[#067647]',
      border: 'border-[#A6F4C5]',
      dot: 'bg-[#12B76A]',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />,
      defaultFactors: [
        { label: 'Green / Orange Industry Category', weight: '-20%', impact: 'positive' },
        { label: 'MIDC Approved Industrial Area', weight: '-15%', impact: 'positive' },
        { label: 'Clean Water Recycle Plan Included', weight: '-10%', impact: 'positive' },
      ] as RiskFactor[],
    },
    MEDIUM: {
      label: 'Medium Risk',
      subtext: 'Standard Review',
      bg: 'bg-[#FFFAEB]',
      text: 'text-[#B54708]',
      border: 'border-[#FEDF89]',
      dot: 'bg-[#F79009]',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#F79009]" />,
      defaultFactors: [
        { label: 'Orange Category Emissions', weight: '+15%', impact: 'neutral' },
        { label: 'Near Water Body (< 5km)', weight: '+12%', impact: 'negative' },
        { label: 'Factory Safety Plan Attached', weight: '-10%', impact: 'positive' },
      ] as RiskFactor[],
    },
    HIGH: {
      label: 'High Risk',
      subtext: 'Joint Inspection Required',
      bg: 'bg-[#FEF3F2]',
      text: 'text-[#B42318]',
      border: 'border-[#FECDCA]',
      dot: 'bg-[#F04438]',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-[#F04438]" />,
      defaultFactors: [
        { label: 'Red Category High Effluent Discharge', weight: '+35%', impact: 'negative' },
        { label: 'Hazardous Chemical Storage > 10KL', weight: '+25%', impact: 'negative' },
        { label: 'Boiler / High Voltage Installation', weight: '+20%', impact: 'negative' },
      ] as RiskFactor[],
    },
  }[computedLevel];

  const displayFactors = factors && factors.length > 0 ? factors : config.defaultFactors;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => showHoverCard && setIsOpen(true)}
      onMouseLeave={() => showHoverCard && setIsOpen(false)}
    >
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none transition-all cursor-default h-[22px]',
          config.bg,
          config.text,
          config.border,
          className
        )}
      >
        {config.icon}
        <span className="font-semibold tabular-nums">{score}</span>
        <span className="text-[11px] opacity-90">· {config.label}</span>
      </div>

      {/* Hover Card (Attio / Stripe style) */}
      {showHoverCard && isOpen && (
        <div
          className="absolute z-50 left-0 top-full mt-1.5 w-72 p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-lg)] animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-2">
            <div className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', config.dot)} />
              <span className="text-xs font-semibold text-[var(--text)]">
                AI Risk Assessment ({score}/100)
              </span>
            </div>
            <span
              className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded',
                config.bg,
                config.text
              )}
            >
              {config.subtext}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-medium text-[var(--text-muted)]">
              Scoring Factors:
            </div>
            {displayFactors.map((factor, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs text-[var(--text)]"
              >
                <span className="truncate pr-2 text-[11px] text-[var(--text-muted)]">
                  {factor.label}
                </span>
                <span
                  className={cn(
                    'font-mono text-[11px] font-medium tabular-nums',
                    factor.impact === 'positive'
                      ? 'text-[#067647]'
                      : factor.impact === 'negative'
                      ? 'text-[#B42318]'
                      : 'text-[var(--text-muted)]'
                  )}
                >
                  {factor.weight}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-subtle)]">
            <span>Evaluated by Rule Engine</span>
            <span className="font-mono text-[10px]">Rule v2.4</span>
          </div>
        </div>
      )}
    </div>
  );
}
