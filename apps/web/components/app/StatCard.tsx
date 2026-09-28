'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: number | string;
  delta?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  subtitle?: string;
  sparklineData?: number[];
  prefix?: string;
  suffix?: string;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  delta,
  subtitle,
  sparklineData = [12, 18, 14, 22, 28, 24, 30],
  prefix = '',
  suffix = '',
  className,
  interactive = false,
  onClick,
}: StatCardProps) {
  // Animated counter effect for numeric values
  const [displayValue, setDisplayValue] = useState<string | number>(
    typeof value === 'number' ? 0 : value
  );

  useEffect(() => {
    if (typeof value === 'number') {
      const start = 0;
      const end = value;
      const duration = 600; // ms
      const startTime = performance.now();

      function update(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.round(start + (end - start) * ease);
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  // Generate SVG path for sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const height = 28;
  const width = 80;

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width;
      const y = height - ((val - minVal) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative overflow-hidden surface-card p-4 transition-all duration-200 select-none border border-[var(--border)] hover:border-[var(--border-strong)] hover:shadow-xs',
        interactive && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              180px circle at ${mouseX}px ${mouseY}px,
              rgba(42, 71, 201, 0.08),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-muted)] tracking-tight">
            {label}
          </span>
          {delta && (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full',
                delta.trend === 'up'
                  ? 'bg-[var(--success-bg)] text-[var(--success-text)]'
                  : delta.trend === 'down'
                  ? 'bg-[var(--danger-bg)] text-[var(--danger-text)]'
                  : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
              )}
            >
              {delta.trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {delta.trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {delta.trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{delta.value}</span>
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="text-2xl font-semibold tracking-tight text-[var(--text)] font-mono tabular-nums">
            {prefix}
            {typeof displayValue === 'number'
              ? displayValue.toLocaleString('en-IN')
              : displayValue}
            {suffix}
          </div>

          {/* Minimal Sparkline */}
          {sparklineData && sparklineData.length > 1 && (
            <svg
              width={width}
              height={height}
              className="overflow-visible shrink-0 opacity-70"
            >
              <polyline
                fill="none"
                stroke="var(--primary-500)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          )}
        </div>

        {subtitle && (
          <div className="mt-1 text-xs text-[var(--text-subtle)] truncate">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
