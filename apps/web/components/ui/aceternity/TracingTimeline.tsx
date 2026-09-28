'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface TimelineEntry {
  title: string;
  department?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'AT_RISK';
  date?: string;
  slaInfo?: string;
  content?: React.ReactNode;
}

export function TracingTimeline({
  data,
  className,
}: {
  data: TimelineEntry[];
  className?: string;
}) {
  return (
    <div className={cn('w-full font-sans relative py-4', className)}>
      <div className="relative max-w-7xl mx-auto pb-10">
        {data.map((item, index) => {
          const isDone = item.status === 'COMPLETED';
          const isActive = item.status === 'IN_PROGRESS';
          const isRisk = item.status === 'AT_RISK';

          return (
            <div
              key={index}
              className="flex justify-start pt-6 md:pt-10 md:gap-8 relative group"
            >
              {/* Left Column: Timestamp & Indicator Pill */}
              <div className="sticky flex flex-col md:flex-row z-20 items-center top-24 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className={cn(
                  'h-8 w-8 absolute left-3 md:left-3 rounded-full flex items-center justify-center border shadow-xs transition-colors',
                  isDone
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : isActive
                    ? 'bg-[#2A47C9] border-[#1E3A8A] text-white ring-4 ring-blue-100'
                    : isRisk
                    ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                    : 'bg-white border-slate-200 text-slate-400'
                )}>
                  {isDone ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isActive ? (
                    <Clock className="h-4 w-4" />
                  ) : isRisk ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </div>

                <div className="hidden md:block md:pl-16 space-y-0.5">
                  <h3 className="font-extrabold text-sm text-slate-800 leading-tight">
                    {item.title}
                  </h3>
                  {item.department && (
                    <div className="text-[11px] font-mono text-[#2A47C9] font-bold">
                      {item.department}
                    </div>
                  )}
                  {item.slaInfo && (
                    <div className="text-[10px] text-slate-500 font-medium">
                      {item.slaInfo}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Content Card */}
              <div className="relative pl-14 md:pl-4 w-full">
                <div className="md:hidden block mb-2">
                  <h3 className="font-extrabold text-sm text-slate-800">
                    {item.title}
                  </h3>
                  {item.department && (
                    <div className="text-[10px] font-mono text-[#2A47C9] font-bold">
                      {item.department}
                    </div>
                  )}
                </div>

                <div className={cn(
                  'rounded-2xl p-4 sm:p-5 border transition-all duration-300',
                  isActive
                    ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                    : isDone
                    ? 'bg-white border-slate-200/90 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200/60'
                )}>
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Vertical Connecting Line */}
        <div className="absolute md:left-[1.85rem] left-[1.85rem] top-8 bottom-6 w-[2px] bg-gradient-to-b from-emerald-500 via-[#2A47C9] to-slate-200 rounded-full" />
      </div>
    </div>
  );
}
