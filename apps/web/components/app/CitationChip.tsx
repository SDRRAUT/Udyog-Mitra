'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, BookOpen } from 'lucide-react';

export interface Citation {
  id: number | string;
  source: string;
  section?: string;
  text: string;
  url?: string;
}

export interface CitationChipProps {
  citation: Citation;
  index?: number;
  className?: string;
}

export function CitationChip({ citation, index, className }: CitationChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const displayIndex = index !== undefined ? index + 1 : citation.id;

  return (
    <span
      className="relative inline-block mx-0.5"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center w-4 h-4 text-[10px] font-mono font-semibold rounded-full',
          'bg-[var(--primary-50)] text-[var(--primary-600)] border border-[var(--primary-200)] hover:bg-[var(--primary-100)] transition-colors cursor-pointer',
          className
        )}
        aria-label={`Source citation ${displayIndex}`}
      >
        {displayIndex}
      </button>

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] shadow-[var(--shadow-lg)] animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[var(--border)] mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] truncate">
              <BookOpen className="w-3.5 h-3.5 text-[var(--primary-600)] shrink-0" />
              <span className="truncate">{citation.source}</span>
            </div>
            {citation.section && (
              <span className="text-[10px] font-mono text-[var(--text-subtle)] shrink-0">
                {citation.section}
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] line-clamp-3 italic leading-relaxed">
            &ldquo;{citation.text}&rdquo;
          </p>
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary-600)] hover:underline"
            >
              <span>View Official Gazette / Notification</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </span>
  );
}
