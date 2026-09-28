'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[var(--text-subtle)]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-sm text-[var(--text)] placeholder:text-[var(--text-subtle)] shadow-xs transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:border-[var(--primary-500)]',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--surface-2)]',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-[var(--danger)] focus-visible:ring-[var(--danger)]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-[var(--text-subtle)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--danger-text)] flex items-center gap-1 font-medium">
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
