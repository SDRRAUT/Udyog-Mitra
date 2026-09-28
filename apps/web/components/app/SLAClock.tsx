'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Pause, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export interface SLAClockProps {
  dueDate: string | Date;
  startDate?: string | Date;
  isPaused?: boolean;
  pausedReason?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SLAClock({
  dueDate,
  startDate,
  isPaused = false,
  pausedReason = 'Awaiting query response',
  size = 'md',
  className,
}: SLAClockProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isBreached: boolean;
    isNearBreach: boolean; // < 24h
    percentage: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    isBreached: false,
    isNearBreach: false,
    percentage: 100,
  });

  useEffect(() => {
    function calculate() {
      if (!dueDate) {
        setTimeLeft({
          days: 14,
          hours: 0,
          minutes: 0,
          isBreached: false,
          isNearBreach: false,
          percentage: 50,
        });
        return;
      }
      const now = new Date().getTime();
      const target = new Date(dueDate).getTime();
      if (isNaN(target)) {
        setTimeLeft({
          days: 14,
          hours: 0,
          minutes: 0,
          isBreached: false,
          isNearBreach: false,
          percentage: 50,
        });
        return;
      }
      const start = startDate ? new Date(startDate).getTime() : target - 30 * 24 * 60 * 60 * 1000;
      const totalSpan = (target - start) > 0 ? (target - start) : 30 * 24 * 60 * 60 * 1000;
      const remaining = target - now;

      if (remaining <= 0) {
        setTimeLeft({
          days: Math.abs(Math.floor(remaining / (1000 * 60 * 60 * 24))),
          hours: Math.abs(Math.floor((remaining / (1000 * 60 * 60)) % 24)),
          minutes: Math.abs(Math.floor((remaining / (1000 * 60)) % 60)),
          isBreached: true,
          isNearBreach: false,
          percentage: 0,
        });
      } else {
        const percentage = Math.max(0, Math.min(100, Math.round((remaining / totalSpan) * 100)));
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        const remHours = hours % 24;
        const minutes = Math.floor((remaining / (1000 * 60)) % 60);

        setTimeLeft({
          days,
          hours: remHours,
          minutes,
          isBreached: false,
          isNearBreach: hours < 48,
          percentage: isNaN(percentage) ? 50 : percentage,
        });
      }
    }

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [dueDate, startDate]);

  // Dimension mapping
  const dimensions = {
    sm: { radius: 14, stroke: 3, svgSize: 34, text: 'text-[11px]' },
    md: { radius: 20, stroke: 4, svgSize: 48, text: 'text-xs' },
    lg: { radius: 28, stroke: 5, svgSize: 66, text: 'text-sm' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const validPercentage = isNaN(timeLeft.percentage) ? 50 : timeLeft.percentage;
  const strokeDashoffset = isPaused
    ? circumference * 0.25
    : circumference - (validPercentage / 100) * circumference;

  let colorClass = 'text-[var(--success)]';
  let strokeColor = 'var(--success)';
  let bgFill = 'text-[var(--success-bg)]';
  let statusText = `${timeLeft.days}d ${timeLeft.hours}h left`;

  if (isPaused) {
    colorClass = 'text-[var(--text-muted)]';
    strokeColor = 'var(--text-subtle)';
    bgFill = 'text-[var(--surface-2)]';
    statusText = 'Paused';
  } else if (timeLeft.isBreached) {
    colorClass = 'text-[var(--danger)]';
    strokeColor = 'var(--danger)';
    bgFill = 'text-[var(--danger-bg)]';
    statusText = `Breached by ${timeLeft.days}d`;
  } else if (timeLeft.isNearBreach) {
    colorClass = 'text-[var(--warning)]';
    strokeColor = 'var(--warning)';
    bgFill = 'text-[var(--warning-bg)]';
    statusText = `${timeLeft.hours}h left (At risk)`;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 select-none',
        timeLeft.isNearBreach && !isPaused && 'animate-soft-pulse',
        className
      )}
      title={
        isPaused
          ? `SLA Paused: ${pausedReason}`
          : `Due date: ${new Date(dueDate).toLocaleDateString('en-IN')}`
      }
    >
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={dimensions.svgSize}
          height={dimensions.svgSize}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={dimensions.radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth={dimensions.stroke}
          />
          {/* Progress */}
          <circle
            cx={dimensions.svgSize / 2}
            cy={dimensions.svgSize / 2}
            r={dimensions.radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Center icon / percentage */}
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium">
          {isPaused ? (
            <Pause className="w-3 h-3 text-[var(--text-muted)]" />
          ) : timeLeft.isBreached ? (
            <AlertCircle className="w-3.5 h-3.5 text-[var(--danger)]" />
          ) : size === 'lg' ? (
            <span className={colorClass}>{timeLeft.percentage}%</span>
          ) : (
            <Clock className={cn('w-3 h-3', colorClass)} />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            'font-mono font-medium tabular-nums tracking-tight',
            dimensions.text,
            colorClass
          )}
        >
          {statusText}
        </span>
        {isPaused && (
          <span className="text-[11px] text-[var(--text-subtle)] truncate max-w-[130px]">
            {pausedReason}
          </span>
        )}
      </div>
    </div>
  );
}
