import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { EmergencyAlert, EmergencySeverity } from '../../types/emergency';
import { emergencyService } from '../../services/emergencyService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import {
  AlertTriangle,
  Radio,
  Plus,
  Trash2,
  CheckCircle2,
  Power,
  Volume2,
  MapPin,
  Search,
  Home as HomeIcon
} from 'lucide-react';

interface ManageEmergenciesScreenProps {
  onOpenBroadcastModal: () => void;
  onViewAlertDetails: (alert: EmergencyAlert) => void;
  onExitToHome?: () => void;
}

export const ManageEmergenciesScreen: React.FC<ManageEmergenciesScreenProps> = ({
  onOpenBroadcastModal,
  onViewAlertDetails,
  onExitToHome
}) => {
  const { allAlerts, refreshData, triggerAlarm } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    emergencyService.updateAlertStatus(id, !currentStatus);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this disaster alert record?')) {
      emergencyService.deleteAlert(id);
      refreshData();
    }
  };

  let filtered = allAlerts;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.targetDistrict.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q)
    );
  }
  if (filterSeverity !== 'ALL') {
    filtered = filtered.filter(a => a.severity === filterSeverity);
  }

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
              Disaster Management Command
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Manage Emergency Alerts
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="danger"
              onClick={onOpenBroadcastModal}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-black uppercase"
            >
              Create
            </Button>

            {onExitToHome && (
              <button
                onClick={onExitToHome}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
                title="Exit to Home"
              >
                <HomeIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alerts by title or region..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🔵 Low</option>
          </select>
        </div>
      </div>

      {/* Emergency Alerts List */}
      <div className="space-y-3">
        {filtered.map(alert => (
          <div
            key={alert.id}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all space-y-3 ${
              alert.isActive
                ? 'border-red-200 dark:border-red-900/60 shadow-md shadow-red-500/5'
                : 'border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={alert.severity} variant="severity" size="sm" />
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.isActive ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {alert.isActive ? '🟢 BROADCASTING' : '⚪ DEACTIVATED'}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1.5 leading-tight">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>
                    {alert.targetDistrict}, {alert.targetState} • {formatRelativeTime(alert.broadcastTime)}
                  </span>
                </p>
              </div>

              <div className="text-right text-xs shrink-0 font-bold">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Acknowledgements:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {alert.acknowledgedCount.toLocaleString()} / {alert.totalTargetedUsers.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {alert.headline}
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <p><strong className="text-slate-900 dark:text-white">Action Protocol:</strong> {alert.recommendedAction}</p>
              <p><strong className="text-slate-900 dark:text-white">Issuing Dept:</strong> {alert.issuerDepartment}</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleActive(alert.id, alert.isActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    alert.isActive
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'
                      : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{alert.isActive ? 'Deactivate' : 'Re-activate'}</span>
                </button>

                {alert.requiresAlarm && (
                  <button
                    onClick={() => triggerAlarm(alert)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500"
                    title="Test alarm siren locally"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewAlertDetails(alert)}
                  className="text-xs font-bold"
                >
                  Inspect
                </Button>

                <button
                  onClick={() => handleDelete(alert.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
