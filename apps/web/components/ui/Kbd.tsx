'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-mono font-medium',
        'text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border-strong)] rounded shadow-xs select-none',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
