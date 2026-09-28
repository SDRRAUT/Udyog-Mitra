'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Lock, Pause, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export type StatusType =
  | 'DRAFT'
  | 'LOCKED'
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'UNDER_SCRUTINY'
  | 'QUERY_RAISED'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_PENDING'
  | 'RECOMMENDED'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  // SLA statuses
  | 'ON_TRACK'
  | 'AT_RISK'
  | 'BREACHED'
  | 'PAUSED'
  // Risk
  | 'LOW_RISK'
  | 'MEDIUM_RISK'
  | 'HIGH_RISK'
  // Applicability
  | 'MANDATORY'
  | 'CONDITIONAL'
  | 'OPTIONAL'
  | 'EXTERNAL'
  // Generic
  | 'SUCCESS'
  | 'WARNING'
  | 'DANGER'
  | 'INFO'
  | 'NEUTRAL';

interface StatusConfig {
  label: string;
  bg: string;
  text: string;
  border?: string;
  dotColor: string;
  pulse?: boolean;
  icon?: React.ReactNode;
}

const STATUS_CONFIGS: Record<StatusType, StatusConfig> = {
  DRAFT: {
    label: 'Draft',
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#344054]',
    border: 'border-[#D0D5DD]',
    dotColor: 'bg-[#667085]',
  },
  LOCKED: {
    label: 'Locked',
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#475467]',
    border: 'border-[#D0D5DD]',
    dotColor: 'bg-[#98A2B3]',
    icon: <Lock className="w-3 h-3 text-[#475467]" />,
  },
  SUBMITTED: {
    label: 'Submitted',
    bg: 'bg-[#EFF8FF]',
    text: 'text-[#175CD3]',
    border: 'border-[#B2DDFF]',
    dotColor: 'bg-[#2E90FA]',
  },
  ASSIGNED: {
    label: 'Assigned',
    bg: 'bg-[#EFF8FF]',
    text: 'text-[#175CD3]',
    border: 'border-[#B2DDFF]',
    dotColor: 'bg-[#2E90FA]',
  },
  UNDER_SCRUTINY: {
    label: 'Under Scrutiny',
    bg: 'bg-[#EFF4FF]',
    text: 'text-[#2A47C9]',
    border: 'border-[#B9CCFD]',
    dotColor: 'bg-[#3A5FE5]',
  },
  QUERY_RAISED: {
    label: 'Query Raised',
    bg: 'bg-[#FFFAEB]',
    text: 'text-[#B54708]',
    border: 'border-[#FEDF89]',
    dotColor: 'bg-[#F79009]',
    icon: <AlertTriangle className="w-3 h-3 text-[#B54708]" />,
  },
  INSPECTION_SCHEDULED: {
    label: 'Inspection Scheduled',
    bg: 'bg-[#F4F3FF]',
    text: 'text-[#5925DC]',
    border: 'border-[#D9D6FE]',
    dotColor: 'bg-[#7A5AF8]',
  },
  INSPECTION_PENDING: {
    label: 'Joint Inspection',
    bg: 'bg-[#F4F3FF]',
    text: 'text-[#5925DC]',
    border: 'border-[#D9D6FE]',
    dotColor: 'bg-[#7A5AF8]',
  },
  RECOMMENDED: {
    label: 'Recommended',
    bg: 'bg-[#EFF4FF]',
    text: 'text-[#2239A3]',
    border: 'border-[#8AA9FA]',
    dotColor: 'bg-[#2239A3]',
  },
  APPROVED: {
    label: 'Approved',
    bg: 'bg-[#ECFDF3]',
    text: 'text-[#067647]',
    border: 'border-[#A6F4C5]',
    dotColor: 'bg-[#12B76A]',
    icon: <CheckCircle2 className="w-3 h-3 text-[#067647]" />,
  },
  REJECTED: {
    label: 'Rejected',
    bg: 'bg-[#FEF3F2]',
    text: 'text-[#B42318]',
    border: 'border-[#FECDCA]',
    dotColor: 'bg-[#F04438]',
  },
  RETURNED: {
    label: 'Returned',
    bg: 'bg-[#FFFAEB]',
    text: 'text-[#B54708]',
    border: 'border-[#FEDF89]',
    dotColor: 'bg-[#F79009]',
  },

  // SLA
  ON_TRACK: {
    label: 'On Track',
    bg: 'bg-[#ECFDF3]',
    text: 'text-[#067647]',
    border: 'border-[#A6F4C5]',
    dotColor: 'bg-[#12B76A]',
  },
  AT_RISK: {
    label: 'At Risk',
    bg: 'bg-[#FFFAEB]',
    text: 'text-[#B54708]',
    border: 'border-[#FEDF89]',
    dotColor: 'bg-[#F79009]',
    pulse: true,
    icon: <Clock className="w-3 h-3 text-[#B54708]" />,
  },
  BREACHED: {
    label: 'Breached',
    bg: 'bg-[#FEF3F2]',
    text: 'text-[#B42318]',
    border: 'border-[#FECDCA]',
    dotColor: 'bg-[#F04438]',
  },
  PAUSED: {
    label: 'Paused (Query)',
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#475467]',
    border: 'border-[#D0D5DD]',
    dotColor: 'bg-[#98A2B3]',
    icon: <Pause className="w-3 h-3 text-[#475467]" />,
  },

  // Risk
  LOW_RISK: {
    label: 'Low Risk',
    bg: 'bg-[#ECFDF3]',
    text: 'text-[#067647]',
    border: 'border-[#A6F4C5]',
    dotColor: 'bg-[#12B76A]',
  },
  MEDIUM_RISK: {
    label: 'Medium Risk',
    bg: 'bg-[#FFFAEB]',
    text: 'text-[#B54708]',
    border: 'border-[#FEDF89]',
    dotColor: 'bg-[#F79009]',
  },
  HIGH_RISK: {
    label: 'High Risk',
    bg: 'bg-[#FEF3F2]',
    text: 'text-[#B42318]',
    border: 'border-[#FECDCA]',
    dotColor: 'bg-[#F04438]',
  },

  // Applicability
  MANDATORY: {
    label: 'Mandatory',
    bg: 'bg-[#EFF4FF]',
    text: 'text-[#2A47C9]',
    border: 'border-[#B9CCFD]',
    dotColor: 'bg-[#2A47C9]',
  },
  CONDITIONAL: {
    label: 'Conditional',
    bg: 'bg-transparent',
    text: 'text-[#475467]',
    border: 'border-[#D0D5DD]',
    dotColor: 'bg-[#98A2B3]',
  },
  OPTIONAL: {
    label: 'Optional',
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#475467]',
    border: 'border-transparent',
    dotColor: 'bg-[#98A2B3]',
  },
  EXTERNAL: {
    label: 'External (Central)',
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#475467]',
    border: 'border-[#E4E7EC]',
    dotColor: 'bg-[#98A2B3]',
  },

  // Generic
  SUCCESS: {
    label: 'Success',
    bg: 'bg-[#ECFDF3]',
    text: 'text-[#067647]',
    border: 'border-[#A6F4C5]',
    dotColor: 'bg-[#12B76A]',
  },
  WARNING: {
    label: 'Warning',
    bg: 'bg-[#FFFAEB]',
    text: 'text-[#B54708]',
    border: 'border-[#FEDF89]',
    dotColor: 'bg-[#F79009]',
  },
  DANGER: {
    label: 'Danger',
    bg: 'bg-[#FEF3F2]',
    text: 'text-[#B42318]',
    border: 'border-[#FECDCA]',
    dotColor: 'bg-[#F04438]',
  },
  INFO: {
    label: 'Info',
    bg: 'bg-[#EFF8FF]',
    text: 'text-[#175CD3]',
    border: 'border-[#B2DDFF]',
    dotColor: 'bg-[#2E90FA]',
  },
  NEUTRAL: {
    label: 'Neutral',
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#475467]',
    border: 'border-[#E4E7EC]',
    dotColor: 'bg-[#98A2B3]',
  },
};

export interface StatusPillProps {
  status: string;
  label?: string;
  className?: string;
  hideDot?: boolean;
}

export function StatusPill({ status, label, className, hideDot = false }: StatusPillProps) {
  const normalizedKey = (status.toUpperCase().replace(/\s+/g, '_') as StatusType);
  const config = STATUS_CONFIGS[normalizedKey] || {
    label: status,
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#475467]',
    border: 'border-[#E4E7EC]',
    dotColor: 'bg-[#98A2B3]',
  };

  const displayLabel = label || config.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border select-none transition-all',
        'h-[22px]',
        config.bg,
        config.text,
        config.border || 'border-transparent',
        className
      )}
    >
      {config.icon ? (
        config.icon
      ) : !hideDot ? (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            config.dotColor,
            config.pulse && 'animate-soft-pulse'
          )}
        />
      ) : null}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}
