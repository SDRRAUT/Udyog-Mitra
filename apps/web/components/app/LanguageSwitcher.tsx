'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

export type LanguageCode = 'en' | 'hi' | 'mr';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिं' },
  { code: 'mr', label: 'Marathi', native: 'मरा' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('maha_lang') as LanguageCode;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      setCurrentLang(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const handleChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    localStorage.setItem('maha_lang', lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('language_change', { detail: lang }));
  };

  return (
    <div
      className={cn(
        'inline-flex items-center p-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-xs font-medium select-none',
        className
      )}
    >
      {LANGUAGES.map((lang) => {
        const isSelected = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleChange(lang.code)}
            className={cn(
              'px-2 py-1 rounded-md transition-all text-xs font-medium cursor-pointer',
              isSelected
                ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            )}
            title={lang.label}
          >
            {lang.native}
          </button>
        );
      })}
    </div>
  );
}
