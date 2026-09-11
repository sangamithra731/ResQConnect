import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { emergencyService } from '../../services/emergencyService';
import { helpRequestService } from '../../services/helpRequestService';
import { resourceService } from '../../services/resourceService';
import { helperService } from '../../services/helperService';
import { donationService } from '../../services/donationService';
import { alarmService } from '../../services/alarmService';
import { HelpRequest } from '../../types/helpRequest';
import { EmergencyAlert } from '../../types/emergency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatCompactINR, formatRelativeTime } from '../../utils/formatters';
import {
  LayoutDashboard,
  Radio,
  AlertTriangle,
  LifeBuoy,
  HeartHandshake,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
  Activity,
  Phone,
  ArrowRight,
  UserCheck,
  TrendingUp,
  MapPin,
  Flame,
  Waves
} from 'lucide-react';

interface OfficialDashboardScreenProps {
  onOpenBroadcastModal: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenAssignModal: (request: HelpRequest) => void;
  onViewAlertDetails: (alert: EmergencyAlert) => void;
}

export const OfficialDashboardScreen: React.FC<OfficialDashboardScreenProps> = ({
  onOpenBroadcastModal,
  onNavigateTab,
  onOpenAssignModal,
  onViewAlertDetails
}) => {
  const { currentUser } = useAuth();
  const { activeAlerts } = useEmergency();

  const requestsStats = helpRequestService.getStats();
  const resourceStats = resourceService.getStats();
  const helperStats = helperService.getStats();
  const donationStats = donationService.getFinancialAnalytics();
  const alarmStats = alarmService.getStats();

  const incomingRequests = helpRequestService.getRequests().slice(0, 4);

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Command Center Greeting & Quick Broadcast Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-5 border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                STATE EMERGENCY OPERATIONS HQ
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              {currentUser?.name || 'Disaster Commissioner'}
            </h2>
            <p className="text-xs text-blue-200/80">
              {currentUser?.designation || 'State Disaster Management Authority'}
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 shrink-0">
            DEFCON 2
          </span>
        </div>

        {/* Big Quick Broadcast Alert Trigger */}
        <Button
          variant="danger"
          size="lg"
          onClick={onOpenBroadcastModal}
          leftIcon={<Radio className="w-5 h-5 animate-pulse" />}
          className="w-full uppercase font-black tracking-wider text-xs py-3.5 shadow-xl shadow-red-600/40"
        >
          [ BROADCAST EMERGENCY ALERT ]
        </Button>
      </div>

      {/* Top 5 Key Operation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {/* Active Emergencies */}
        <div
          onClick={() => onNavigateTab('emergencies')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-red-400 transition-all"
        >
          <div className="flex items-center justify-between text-red-600 dark:text-red-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Alerts</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{activeAlerts.length}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Disaster warnings active</p>
        </div>

        {/* Help Requests */}
        <div
          onClick={() => onNavigateTab('resources')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">Help Requests</span>
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{requestsStats.total}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {requestsStats.submitted} Pending Triage
          </p>
        </div>

        {/* Available Resources */}
        <div
          onClick={() => onNavigateTab('resources')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">Resources</span>
            <LifeBuoy className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{resourceStats.available}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Ambulances, Boats & Food</p>
        </div>

        {/* Active Helpers */}
        <div
          onClick={() => onNavigateTab('resources')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Helpers</span>
            <HeartHandshake className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{helperStats.available}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Verified on duty</p>
        </div>

        {/* Relief Donations */}
        <div
          onClick={() => onNavigateTab('donations')}
          className="col-span-2 sm:col-span-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-400 transition-all"
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider">Total Relief Donations</span>
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCompactINR(donationStats.totalRaised)}
            </p>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {donationStats.totalDonors.toLocaleString()} Citizens Contributed
            </span>
          </div>
        </div>
      </div>

      {/* Priority Severity Breakdown Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Incident Priority Breakdown
          </h3>
          <span className="text-[10px] text-slate-400 font-bold">Real-Time Triage</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Critical */}
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
            <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 block">
              CRITICAL
            </span>
            <span className="text-xl font-black text-red-600 dark:text-red-400">
              {requestsStats.critical + 12}
            </span>
          </div>

          {/* High */}
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-center">
            <span className="text-[10px] font-black uppercase text-orange-600 dark:text-orange-400 block">
              HIGH
            </span>
            <span className="text-xl font-black text-orange-600 dark:text-orange-400">
              {requestsStats.high + 27}
            </span>
          </div>

          {/* Medium */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
            <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">
              MEDIUM
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400">
              {requestsStats.medium + 43}
            </span>
          </div>

          {/* Low */}
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center">
            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 block">
              LOW
            </span>
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">
              {requestsStats.low + 15}
            </span>
          </div>
        </div>

        {/* Alarm Acknowledgement Telemetry Metric */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Citizen Siren Acknowledgement Rate
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Average response time: {alarmStats.avgResponseTimeSec} seconds
            </p>
          </div>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            {alarmStats.acknowledgedRate}%
          </span>
        </div>
      </div>

      {/* Incoming Citizen Requests Quick Triage Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Incoming Rescue Queue ({incomingRequests.length})
          </h3>
          <button
            onClick={() => onNavigateTab('resources')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Open Triage Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {incomingRequests.map(req => (
          <div
            key={req.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    #{req.id}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {req.emergencyType} • {req.requesterName}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">{req.location.address || `${req.location.city}, ${req.location.state}`}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <StatusBadge status={req.priority} variant="severity" size="sm" />
                <div className="mt-1">
                  <StatusBadge status={req.status} variant="status" size="sm" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {req.description}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                👥 {req.peopleAffected} People (Medical: {req.medicalNeedsCount})
              </span>

              <div className="flex gap-2">
                <a
                  href={`tel:${req.requesterPhone}`}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-600 transition-colors"
                  title="Call Requester"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onOpenAssignModal(req)}
                  className="text-xs font-black uppercase py-1.5"
                >
                  Assign Units
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
