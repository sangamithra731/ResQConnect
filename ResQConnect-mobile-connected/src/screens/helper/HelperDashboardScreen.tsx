import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { helperService } from '../../services/helperService';
import { helpRequestService } from '../../services/helpRequestService';
import { HelperAvailability } from '../../types/helper';
import { HelpRequest } from '../../types/helpRequest';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatRelativeTime } from '../../utils/formatters';
import {
  HeartHandshake,
  Radio,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Activity,
  Flame,
  Waves,
  Star,
  Power
} from 'lucide-react';

interface HelperDashboardScreenProps {
  onNavigateTab: (tab: any) => void;
  onOpenMission: (request: HelpRequest) => void;
}

export const HelperDashboardScreen: React.FC<HelperDashboardScreenProps> = ({
  onNavigateTab,
  onOpenMission
}) => {
  const { currentUser } = useAuth();
  const { refreshData } = useEmergency();

  const helper = helperService.getHelperById(currentUser?.id || 'user-helper-1') || helperService.getHelpers()[0];
  const [availability, setAvailability] = useState<HelperAvailability>(helper.availability);

  const allRequests = helpRequestService.getRequests();
  const nearbyRequests = allRequests.filter(r => r.status === 'SUBMITTED');
  const activeMission = allRequests.find(r => r.id === helper.activeMissionId) || allRequests.find(r => r.status === 'RESPONDING');
  const completedMissions = allRequests.filter(r => r.status === 'RESOLVED' || r.status === 'ASSISTANCE_PROVIDED');

  const handleToggleAvailability = () => {
    const next: HelperAvailability = availability === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    setAvailability(next);
    helperService.toggleAvailability(helper.id, next);
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Greeting & Live Availability Switch */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={helper.avatar}
                alt={helper.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              />
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 absolute -bottom-1 -right-1 ${
                  availability === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Hello Responder,
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                {currentUser?.name || helper.name}
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[200px]">
                {helper.verificationBadge}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1">
              ⭐ {helper.rating}
            </span>
            <span className="text-[10px] text-slate-400">{helper.completedMissions} missions</span>
          </div>
        </div>

        {/* Availability Toggle Switch */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                availability === 'AVAILABLE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {availability === 'AVAILABLE' ? '🟢 AVAILABLE FOR DISPATCH' : '⚪ OFFLINE / ON BREAK'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {availability === 'AVAILABLE' ? 'Receiving real-time SOS alerts in 5km radius' : 'Standby mode'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleAvailability}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              availability === 'AVAILABLE'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{availability === 'AVAILABLE' ? 'ONLINE' : 'GO ONLINE'}</span>
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Nearby Requests */}
        <div
          onClick={() => onNavigateTab('requests')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-[10px] font-black uppercase">Nearby Requests</span>
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{nearbyRequests.length}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Unassigned emergencies</p>
        </div>

        {/* Assigned Missions */}
        <div
          onClick={() => activeMission && onOpenMission(activeMission)}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
            <span className="text-[10px] font-black uppercase">Assigned</span>
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{activeMission ? 1 : 0}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Active deployment</p>
        </div>

        {/* Completed Assistance */}
        <div
          onClick={() => onNavigateTab('history')}
          className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-[10px] font-black uppercase">Completed</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{helper.completedMissions}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Total lives assisted</p>
        </div>

        {/* Response Time */}
        <div className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-amber-500 mb-1">
            <span className="text-[10px] font-black uppercase">Avg Speed</span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{helper.avgResponseTimeMin}m</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Response time</p>
        </div>
      </div>

      {/* Active Mission Card (if one is currently in progress) */}
      {activeMission && (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 border border-emerald-500/40 shadow-xl space-y-3 animate-pulse-fast">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 inline-block mb-1">
                🟡 ACTIVE RESCUE MISSION
              </span>
              <h3 className="text-base font-black text-white">
                {activeMission.emergencyType} • #{activeMission.id}
              </h3>
              <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{activeMission.location.address}</span>
              </p>
            </div>

            <Button
              size="sm"
              variant="success"
              onClick={() => onOpenMission(activeMission)}
              className="text-xs font-black uppercase shrink-0 py-2"
            >
              Open Navigation
            </Button>
          </div>
        </div>
      )}

      {/* Nearby Urgent Requests Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Available Nearby Rescue Calls ({nearbyRequests.length})
          </h3>
          <button
            onClick={() => onNavigateTab('requests')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nearbyRequests.map(req => (
          <div
            key={req.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-400 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
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

              <StatusBadge status={req.priority} variant="severity" size="sm" />
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {req.description}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                👥 <strong>{req.peopleAffected} persons</strong> ({req.childrenCount} kids, {req.elderlyCount} elderly)
              </span>

              <Button
                size="sm"
                variant="success"
                onClick={() => onOpenMission(req)}
                className="text-xs font-black uppercase py-1.5"
              >
                Inspect & Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
