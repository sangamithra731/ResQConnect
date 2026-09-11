import React, { useState } from 'react';
import { helpRequestService } from '../../services/helpRequestService';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { HelpRequest } from '../../types/helpRequest';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Radio,
  MapPin,
  Phone,
  Check,
  X,
  ArrowRight,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Home as HomeIcon
} from 'lucide-react';

interface HelperRequestsScreenProps {
  onOpenMission: (request: HelpRequest) => void;
  onExitToHome?: () => void;
}

export const HelperRequestsScreen: React.FC<HelperRequestsScreenProps> = ({
  onOpenMission,
  onExitToHome
}) => {
  const { currentUser } = useAuth();
  const { refreshData } = useEmergency();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const requests = helpRequestService.getRequests();

  const handleAcceptRequest = (request: HelpRequest) => {
    const actorName = currentUser?.name || 'Volunteer Responder';
    helpRequestService.updateStatus(
      request.id,
      'RESPONDING',
      actorName,
      `Accepted by volunteer ${actorName}. En route to coordinates.`
    );
    refreshData();
    onOpenMission(request);
  };

  const handleDeclineRequest = (requestId: string) => {
    alert(`Request #${requestId} passed to next volunteer in queue.`);
  };

  let filtered = requests;
  if (filterPriority !== 'ALL') {
    filtered = filtered.filter(r => r.priority === filterPriority);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      r =>
        r.emergencyType.toLowerCase().includes(q) ||
        r.requesterName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.address?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              On-Duty Dispatch Queue
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency Help Requests
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              {requests.length} Total
            </span>

            {onExitToHome && (
              <button
                onClick={onExitToHome}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
                title="Exit to Home"
              >
                <HomeIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>Exit</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hazard, location..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">🔴 Critical</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🟡 Medium</option>
            <option value="LOW">🔵 Low</option>
          </select>
        </div>
      </div>

      {/* Requests Feed */}
      <div className="space-y-3">
        {filtered.map(req => {
          const isResponding = req.status === 'RESPONDING';
          const isResolved = req.status === 'RESOLVED' || req.status === 'ASSISTANCE_PROVIDED';

          return (
            <div
              key={req.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all space-y-3 ${
                isResponding
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
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
                    <span>
                      {req.location.address || `${req.location.city}, ${req.location.state}`} • {formatRelativeTime(req.createdAt)}
                    </span>
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

              {/* Requirement & People Metric */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">
                    People Affected
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {req.peopleAffected} (Kids: {req.childrenCount}, Seniors: {req.elderlyCount})
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold block">
                    Required Skills
                  </span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    {req.emergencyType === 'Medical'
                      ? 'First Aid / CPR / Paramedic'
                      : req.emergencyType === 'Flood'
                      ? 'Boat Pilot / Water Rescue'
                      : 'Relief Logistics'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={`tel:${req.requesterPhone}`}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {req.requesterName.split(' ')[0]}</span>
                </a>

                {isResolved ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Mission Completed
                  </span>
                ) : isResponding ? (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onOpenMission(req)}
                    className="text-xs font-black uppercase"
                  >
                    Open Active Mission
                  </Button>
                ) : (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
                    >
                      [ DECLINE ]
                    </button>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleAcceptRequest(req)}
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                      className="text-xs font-black uppercase shadow-md shadow-emerald-600/20"
                    >
                      [ ACCEPT ]
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
