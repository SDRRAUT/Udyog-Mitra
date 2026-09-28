'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  badge,
  actions,
  tabs,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('border-b border-[var(--border)] bg-[var(--surface)]', className)}>
      <div className="px-6 py-4">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">
                {title}
              </h1>
              {badge}
            </div>
            {description && (
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto max-w-full">
              {actions}
            </div>
          )}
        </div>

        {tabs && <div className="mt-4 -mb-4">{tabs}</div>}
      </div>
    </div>
  );
}
