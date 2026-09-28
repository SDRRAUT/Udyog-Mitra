'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SLACountdownProps {
  slaDueAt: string | Date | null | undefined;
  slaBreached?: boolean;
  compact?: boolean;
}

export default function SLACountdown({ slaDueAt, slaBreached, compact = false }: SLACountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOverdue: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: false });

  useEffect(() => {
    if (!slaDueAt) return;

    const calculate = () => {
      const target = new Date(slaDueAt).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        const overdueMs = Math.abs(diff);
        const days = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((overdueMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((overdueMs % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isOverdue: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isOverdue: false });
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [slaDueAt]);

  if (!slaDueAt) return <span className="text-xs text-slate-500">No SLA Target</span>;

  if (timeLeft.isOverdue || slaBreached) {
    if (compact) {
      return (
        <span className="text-xs font-bold text-rose-400 flex items-center">
          <ShieldAlert className="w-3.5 h-3.5 mr-1 animate-pulse" />
          BREACHED (+{timeLeft.days}d {timeLeft.hours}h)
        </span>
      );
    }
    return (
      <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold animate-pulse">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        <span>
          OVERDUE: +{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  const isAtRisk = timeLeft.days === 0 && timeLeft.hours < 24;

  if (compact) {
    return (
      <span
        className={`text-xs font-mono font-semibold flex items-center ${
          isAtRisk ? 'text-amber-400 animate-pulse' : 'text-emerald-400'
        }`}
      >
        <Clock className="w-3.5 h-3.5 mr-1" />
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </span>
    );
  }

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-mono font-semibold border ${
        isAtRisk
          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 animate-pulse'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
      }`}
    >
      <Clock className="w-4 h-4 shrink-0" />
      <span>
        SLA Due in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
}
