import React from 'react';
import { EmergencySeverity } from '../../types/emergency';
import { HelpRequestStatus } from '../../types/helpRequest';

interface StatusBadgeProps {
  status?: HelpRequestStatus | EmergencySeverity | string;
  variant?: 'severity' | 'status' | 'verification' | 'availability';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'status',
  className = '',
  size = 'md'
}) => {
  if (!status) return null;

  let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let label = status;

  if (variant === 'severity') {
    switch (status) {
      case 'CRITICAL':
        colorClasses = 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
        label = '🚨 CRITICAL';
        break;
      case 'HIGH':
        colorClasses = 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30';
        label = '⚠️ HIGH';
        break;
      case 'MEDIUM':
        colorClasses = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        label = '⚡ MEDIUM';
        break;
      case 'LOW':
        colorClasses = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
        label = 'ℹ️ LOW';
        break;
    }
  } else if (variant === 'status') {
    switch (status) {
      case 'SUBMITTED':
        colorClasses = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
        label = '⏳ Submitted';
        break;
      case 'ASSIGNED':
        colorClasses = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
        label = '📋 Assigned';
        break;
      case 'RESPONDING':
        colorClasses = 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 animate-pulse';
        label = '🚀 Responding';
        break;
      case 'ASSISTANCE_PROVIDED':
      case 'RESOLVED':
        colorClasses = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        label = '✅ Resolved';
        break;
      case 'AVAILABLE':
        colorClasses = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
        label = '🟢 Available';
        break;
      case 'DISPATCHED':
        colorClasses = 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
        label = '🚐 Dispatched';
        break;
      case 'DEPLETED':
        colorClasses = 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30';
        label = '❌ Depleted';
        break;
    }
  } else if (variant === 'availability') {
    if (status === 'AVAILABLE') {
      colorClasses = 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      label = '🟢 Active & Ready';
    } else if (status === 'BUSY') {
      colorClasses = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      label = '🟡 On Mission';
    } else {
      colorClasses = 'bg-slate-500/15 text-slate-500 dark:text-slate-400 border-slate-500/30';
      label = '⚪ Offline';
    }
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] font-semibold'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-bold'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase ${colorClasses} ${sizeClasses} ${className}`}
    >
      {label}
    </span>
  );
};
