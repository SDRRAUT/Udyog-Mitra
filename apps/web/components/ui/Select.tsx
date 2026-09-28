'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full appearance-none rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1 pr-8 text-sm text-[var(--text)] shadow-xs transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:border-[var(--primary-500)]',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-2)]',
            error && 'border-[var(--danger)] focus-visible:ring-[var(--danger)]',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
        {error && (
          <p className="mt-1 text-xs text-[var(--danger-text)] font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
