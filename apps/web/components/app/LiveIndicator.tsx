'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';

interface LiveIndicatorProps {
  isConnected: boolean;
  className?: string;
  showText?: boolean;
}

export function LiveIndicator({ isConnected, className, showText = true }: LiveIndicatorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border select-none transition-all',
        isConnected
          ? 'bg-[var(--success-bg)] text-[var(--success-text)] border-[#A6F4C5]'
          : 'bg-[var(--warning-bg)] text-[var(--warning-text)] border-[#FEDF89] animate-pulse',
        className
      )}
      title={isConnected ? 'Real-time WebSocket connected' : 'Reconnecting to real-time events...'}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full shrink-0',
          isConnected ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'
        )}
      />
      {showText && (
        <span className="font-medium tracking-tight">
          {isConnected ? 'Live' : 'Reconnecting…'}
        </span>
      )}
    </div>
  );
}
