'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)] active:bg-[var(--primary-800)] border border-transparent shadow-xs',
        secondary:
          'bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-3)] active:bg-[var(--border-strong)] border border-[var(--border)] shadow-xs',
        outline:
          'bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface-2)] active:bg-[var(--surface-3)]',
        ghost:
          'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] active:bg-[var(--surface-3)]',
        danger:
          'bg-[var(--danger-bg)] text-[var(--danger-text)] hover:bg-[#FEE4E2] border border-[#FDA29B] active:bg-[#FECDCA]',
        dangerSolid:
          'bg-[var(--danger)] text-white hover:bg-[#D92D20] active:bg-[#B42318] border border-transparent shadow-xs',
        link:
          'bg-transparent text-[var(--primary-600)] hover:underline p-0 h-auto font-normal',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
        md: 'h-9 px-3.5 text-sm rounded-md gap-2',
        lg: 'h-11 px-5 text-base rounded-lg gap-2.5',
        iconSm: 'h-8 w-8 p-0 rounded-md',
        iconMd: 'h-9 w-9 p-0 rounded-md',
        iconLg: 'h-11 w-11 p-0 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
