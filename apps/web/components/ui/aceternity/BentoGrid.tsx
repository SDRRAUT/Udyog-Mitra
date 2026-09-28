'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CardSpotlight } from './CardSpotlight';

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <CardSpotlight
      onClick={onClick}
      className={cn(
        'row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-300 shadow-input p-6 bg-white border border-slate-200/90 justify-between flex flex-col space-y-4',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {header && <div className="w-full flex-1 overflow-hidden rounded-2xl">{header}</div>}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        <div className="flex items-center justify-between mb-2">
          {icon && <div className="text-[#2A47C9]">{icon}</div>}
          {badge && <div>{badge}</div>}
        </div>
        <div className="font-bold text-slate-900 text-sm mb-1 leading-snug">
          {title}
        </div>
        <div className="font-normal text-slate-500 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </CardSpotlight>
  );
}
