import React from 'react';
import { EmergencyAlert } from '../../types/emergency';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { formatRelativeTime } from '../../utils/formatters';
import { AlertTriangle, MapPin, Volume2, Shield, Flame, Waves, Wind, Mountain, Activity, ArrowRight } from 'lucide-react';

interface AlertCardProps {
  alert: EmergencyAlert;
  onViewDetails?: (alert: EmergencyAlert) => void;
  onTestAlarm?: (alert: EmergencyAlert) => void;
  showActions?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onViewDetails,
  onTestAlarm,
  showActions = true
}) => {
  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'Flood':
        return <Waves className="w-5 h-5 text-blue-500" />;
      case 'Cyclone':
        return <Wind className="w-5 h-5 text-cyan-500" />;
      case 'Fire':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Landslide':
        return <Mountain className="w-5 h-5 text-amber-600" />;
      case 'Medical Emergency':
        return <Activity className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const isCritical = alert.severity === 'CRITICAL';

  return (
    <div
      className={`rounded-2xl p-4 transition-all border ${
        isCritical
          ? 'bg-gradient-to-br from-red-50 to-rose-50/50 dark:from-red-950/40 dark:to-slate-900 border-red-200 dark:border-red-900/60 shadow-lg shadow-red-500/5'
          : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isCritical
                ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {getDisasterIcon(alert.type)}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
              {alert.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-red-500" />
              <span className="truncate">
                {alert.targetDistrict}, {alert.targetState}
              </span>
              <span className="text-[10px] opacity-70">• {formatRelativeTime(alert.broadcastTime)}</span>
            </div>
          </div>
        </div>

        <StatusBadge status={alert.severity} variant="severity" size="sm" />
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-3">
        {alert.headline}
      </p>

      {alert.recommendedAction && (
        <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-2.5 text-xs text-slate-700 dark:text-slate-300 mb-3 border border-slate-200/60 dark:border-slate-700/60">
          <p className="font-bold text-red-600 dark:text-red-400 text-[11px] uppercase tracking-wide flex items-center gap-1 mb-0.5">
            <Shield className="w-3 h-3" /> Recommended Action:
          </p>
          <p className="text-[11px] leading-relaxed">{alert.recommendedAction}</p>
        </div>
      )}

      {showActions && (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {onTestAlarm && alert.requiresAlarm && (
            <button
              onClick={() => onTestAlarm(alert)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 hover:text-red-700 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              <span>Simulate Siren</span>
            </button>
          )}

          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(alert)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="ml-auto text-xs py-1.5"
            >
              View Details
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
