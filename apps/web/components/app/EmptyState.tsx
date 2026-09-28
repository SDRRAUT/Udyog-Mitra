'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-dashed border-[var(--border-strong)] rounded-xl bg-[var(--surface)] select-none',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[var(--text)] tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] max-w-sm">
        {description}
      </p>

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex items-center gap-2">
          {actionLabel && (
            <Button size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button size="sm" variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
