import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  ShieldAlert,
  ArrowUpRight,
  Zap,
  Lock
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  type?: 'approval' | 'sla' | 'escalation' | 'risk';
  showIcon?: boolean;
}

export default function StatusBadge({ status, type = 'approval', showIcon = true }: StatusBadgeProps) {
  // SLA Status Badge (Light Modern)
  if (type === 'sla') {
    switch (status) {
      case 'ON_TRACK':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
            {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
            <span>ON TRACK</span>
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
            {showIcon && <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />}
            <span>AT RISK (&lt;24H)</span>
          </span>
        );
      case 'BREACHED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300 animate-pulse">
            {showIcon && <ShieldAlert className="w-3.5 h-3.5 mr-1 text-rose-600" />}
            <span>SLA BREACHED</span>
          </span>
        );
      default:
        return <span className="text-xs text-slate-600 font-medium">{status}</span>;
    }
  }

  // Escalation Badge (Light Modern)
  if (type === 'escalation') {
    switch (status) {
      case 'L1_OFFICER':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            L1 Officer
          </span>
        );
      case 'L2_HOD':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            L2 Dept HOD
          </span>
        );
      case 'L3_DIC':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-300">
            L3 District DIC
          </span>
        );
      case 'L4_STATE_ADMIN':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300 animate-pulse">
            L4 State Admin
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  }

  // Risk Level Badge (Light Modern)
  if (type === 'risk') {
    switch (status) {
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            LOW RISK
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            MEDIUM RISK
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            HIGH RISK
          </span>
        );
      default:
        return <span className="text-xs text-slate-600">{status}</span>;
    }
  }

  // Standard Approval Status Badge (Light Modern)
  switch (status) {
    case 'APPROVED':
    case 'FULLY_APPROVED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
          <span>APPROVED</span>
        </span>
      );
    case 'UNDER_SCRUTINY':
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300">
          {showIcon && <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />}
          <span>UNDER SCRUTINY</span>
        </span>
      );
    case 'SUBMITTED':
    case 'ASSIGNED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-300">
          {showIcon && <Clock className="w-3.5 h-3.5 mr-1 text-sky-600" />}
          <span>ASSIGNED</span>
        </span>
      );
    case 'QUERY_RAISED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-800 border border-orange-300">
          {showIcon && <HelpCircle className="w-3.5 h-3.5 mr-1 text-orange-600" />}
          <span>QUERY RAISED</span>
        </span>
      );
    case 'INSPECTION_SCHEDULED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-300">
          {showIcon && <Calendar className="w-3.5 h-3.5 mr-1 text-purple-600" />}
          <span>INSPECTION SCHEDULED</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
          {showIcon && <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
          <span>REJECTED</span>
        </span>
      );
    case 'LOCKED':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-300">
          {showIcon && <Lock className="w-3.5 h-3.5 mr-1 text-slate-500" />}
          <span>LOCKED (STAGE 2)</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <span>{status}</span>
        </span>
      );
  }
}
