import React from 'react';
import { helpRequestService } from '../../services/helpRequestService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import { Clock, CheckCircle2, MapPin, HeartHandshake, Home as HomeIcon } from 'lucide-react';

interface HelperHistoryScreenProps {
  onExitToHome?: () => void;
}

export const HelperHistoryScreen: React.FC<HelperHistoryScreenProps> = ({ onExitToHome }) => {
  const allRequests = helpRequestService.getRequests();
  const completedMissions = allRequests.filter(
    r => r.status === 'RESOLVED' || r.status === 'ASSISTANCE_PROVIDED'
  );

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Volunteer Service Log
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Completed Assistance History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit trail of past emergency interventions & rescue operations
          </p>
        </div>

        {onExitToHome && (
          <button
            onClick={onExitToHome}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700 shrink-0"
            title="Exit to Home"
          >
            <HomeIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>Exit</span>
          </button>
        )}
      </div>

      {/* History Feed */}
      <div className="space-y-3">
        {completedMissions.length > 0 ? (
          completedMissions.map(req => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      #{req.id}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {req.emergencyType} Emergency
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{req.location.address || `${req.location.city}, ${req.location.state}`}</span>
                  </p>
                </div>

                <StatusBadge status={req.status} variant="status" size="sm" />
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {req.description}
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">
                    People Assisted:
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {req.peopleAffected} persons
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block">
                    Completed At:
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                    {formatDateTime(req.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No history yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your completed rescue missions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
