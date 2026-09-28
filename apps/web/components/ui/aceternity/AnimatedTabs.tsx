'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  className,
  tabClassName,
  activePillClassName,
}: {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
  activePillClassName?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-slate-100/90 backdrop-blur-sm rounded-full border border-slate-200/80 overflow-x-auto no-scrollbar select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-1.5 shrink-0',
              isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800',
              tabClassName
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                className={cn(
                  'absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/80 -z-0',
                  activePillClassName
                )}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold',
                    isActive
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-slate-200 text-slate-500'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
