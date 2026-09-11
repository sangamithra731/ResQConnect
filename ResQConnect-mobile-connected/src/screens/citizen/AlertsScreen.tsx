import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyAlert } from '../../types/emergency';
import { AlertCard } from '../../components/emergency/AlertCard';
import { Button } from '../../components/common/Button';
import { AlertTriangle, Volume2, Search, Home as HomeIcon, ArrowLeft } from 'lucide-react';

interface AlertsScreenProps {
  onViewDetails: (alert: EmergencyAlert) => void;
  onExitToHome?: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ onViewDetails, onExitToHome }) => {
  const { allAlerts, triggerAlarm } = useEmergency();
  const [activeTab, setActiveTab] = useState<'active' | 'previous'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const activeAlerts = allAlerts.filter(a => a.isActive);
  const previousAlerts = allAlerts.filter(a => !a.isActive);

  let displayedAlerts = activeTab === 'active' ? activeAlerts : previousAlerts;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedAlerts = displayedAlerts.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q) ||
        a.targetDistrict.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Exit to Home */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
              State Broadcasting System
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Alerts
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const crit = activeAlerts.find(a => a.severity === 'CRITICAL') || allAlerts[0];
                if (crit) triggerAlarm(crit);
              }}
              className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 hover:bg-red-700 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Test Siren</span>
            </button>

            {onExitToHome && (
              <button
                onClick={onExitToHome}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
                title="Exit to Home"
              >
                <HomeIcon className="w-3.5 h-3.5 text-rose-500" />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disaster alerts by region or hazard..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'active'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Active Alarms ({activeAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'previous'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Past Bulletins ({previousAlerts.length})
          </button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {displayedAlerts.map(alert => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onViewDetails={onViewDetails}
            onTestAlarm={triggerAlarm}
          />
        ))}
      </div>
    </div>
  );
};
