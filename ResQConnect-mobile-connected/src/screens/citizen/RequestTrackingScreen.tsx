import React from 'react';
import { HelpRequest, HelpRequestStatus } from '../../types/helpRequest';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import {
  ArrowLeft,
  Home as HomeIcon,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Radio,
  LifeBuoy
} from 'lucide-react';

interface RequestTrackingScreenProps {
  request: HelpRequest;
  onBack: () => void;
  onExitToHome?: () => void;
}

export const RequestTrackingScreen: React.FC<RequestTrackingScreenProps> = ({
  request,
  onBack,
  onExitToHome
}) => {
  const steps: { status: HelpRequestStatus; label: string; description: string }[] = [
    { status: 'SUBMITTED', label: 'SUBMITTED', description: 'Distress signal received & logged by TNSDMA' },
    { status: 'ASSIGNED', label: 'ASSIGNED', description: 'First responder / rescue boat assigned' },
    { status: 'RESPONDING', label: 'HELPER RESPONDING', description: 'Rescue unit en route to your coordinates' },
    { status: 'ASSISTANCE_PROVIDED', label: 'ASSISTANCE PROVIDED', description: 'On-ground assistance in progress' },
    { status: 'RESOLVED', label: 'RESOLVED', description: 'Emergency safely resolved' }
  ];

  const getStepIndex = (status: HelpRequestStatus): number => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'ASSIGNED':
        return 1;
      case 'RESPONDING':
        return 2;
      case 'ASSISTANCE_PROVIDED':
        return 3;
      case 'RESOLVED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = getStepIndex(request.status);

  const handleExit = () => {
    if (onExitToHome) onExitToHome();
    else onBack();
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header with Exit to Home */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
              Live Rescue Tracking
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Request #{request.id}
            </h2>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
          title="Exit to Home"
        >
          <HomeIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>Exit Home</span>
        </button>
      </div>

      {/* Hero Status Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Emergency Type:
            </span>
            <h3 className="text-xl font-black text-white">{request.emergencyType} Emergency</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{request.location.address || `${request.location.city}, ${request.location.state}`}</span>
            </div>
          </div>

          <StatusBadge status={request.priority} variant="severity" size="md" />
        </div>

        <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-300 space-y-1">
          <p><strong className="text-white">People Affected:</strong> {request.peopleAffected} (Children: {request.childrenCount}, Elderly: {request.elderlyCount}, Medical: {request.medicalNeedsCount})</p>
          <p><strong className="text-white">Description:</strong> {request.description}</p>
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Rescue Status Timeline
        </h3>

        <div className="space-y-4 relative pl-2">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="flex items-start gap-3.5 relative">
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                      idx < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                    isCompleted
                      ? isCurrent
                        ? 'bg-red-600 text-white ring-4 ring-red-500/20 animate-pulse'
                        : 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs font-black tracking-tight ${
                        isCurrent
                          ? 'text-red-600 dark:text-red-400'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned Responders Card */}
      {(request.assignedHelperName || request.assignedResourceName) && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl p-5 border border-emerald-200 dark:border-emerald-900/60 shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Assigned Rescue Squad
          </span>

          {request.assignedHelperName && (
            <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                  🤝
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {request.assignedHelperName}
                  </h4>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    First Responder • ETA ~5 mins
                  </p>
                </div>
              </div>

              {request.assignedHelperPhone && (
                <a
                  href={`tel:${request.assignedHelperPhone}`}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}
            </div>
          )}

          {request.assignedResourceName && (
            <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base shrink-0">
                🛟
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {request.assignedResourceName}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Tamil Nadu Fire & Rescue Logistics Wing
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
