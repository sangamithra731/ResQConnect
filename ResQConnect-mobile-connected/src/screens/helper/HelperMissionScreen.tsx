import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { helpRequestService } from '../../services/helpRequestService';
import { helperService } from '../../services/helperService';
import { HelpRequest } from '../../types/helpRequest';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { EmergencyMap } from '../../components/map/EmergencyMap';
import {
  Navigation,
  ArrowLeft,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  LifeBuoy,
  MessageSquare,
  AlertOctagon,
  Home as HomeIcon
} from 'lucide-react';

interface HelperMissionScreenProps {
  request: HelpRequest;
  onBack: () => void;
  onExitToHome?: () => void;
  onMissionCompleted: () => void;
}

export const HelperMissionScreen: React.FC<HelperMissionScreenProps> = ({
  request,
  onBack,
  onExitToHome,
  onMissionCompleted
}) => {
  const { currentUser } = useAuth();
  const { refreshData } = useEmergency();

  const [currentStatus, setCurrentStatus] = useState(request.status);
  const [completedNote, setCompletedNote] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleMarkArrived = () => {
    const actor = currentUser?.name || 'Assigned First Responder';
    helpRequestService.updateStatus(
      request.id,
      'RESPONDING',
      actor,
      'Responder has ARRIVED at the disaster scene. On-ground extraction initiated.'
    );
    setCurrentStatus('RESPONDING');
    refreshData();
    alert('📍 Scene arrival confirmed. Requester and Control room notified.');
  };

  const handleMarkCompleted = () => {
    const actor = currentUser?.name || 'Assigned First Responder';
    helpRequestService.updateStatus(
      request.id,
      'ASSISTANCE_PROVIDED',
      actor,
      completedNote || 'Emergency assistance successfully rendered. Victims safely transferred.'
    );
    if (currentUser) {
      helperService.updateMissionStatus(currentUser.id, undefined, true);
    }
    setCurrentStatus('ASSISTANCE_PROVIDED');
    refreshData();
    setShowCompleteModal(false);
    onMissionCompleted();
  };

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
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active Rescue Deployment
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Mission #{request.id}
            </h2>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
          title="Exit to Home"
        >
          <HomeIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span>Exit Home</span>
        </button>
      </div>

      {/* Hero Dispatch Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-5 border border-emerald-500/40 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-slate-950 inline-block mb-1">
              🟡 EN ROUTE
            </span>
            <h3 className="text-xl font-black text-white">{request.emergencyType} Emergency</h3>
            <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{request.location.address || `${request.location.city}, ${request.location.state}`}</span>
            </p>
          </div>

          <StatusBadge status={request.priority} variant="severity" size="md" />
        </div>

        {/* Live Navigation Metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Distance:</span>
            <p className="text-base font-black text-white">1.8 km</p>
          </div>

          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Arrival:</span>
            <p className="text-base font-black text-emerald-400">~6 mins (Zodiac Boat)</p>
          </div>
        </div>
      </div>

      {/* Interactive Turn-by-Turn Map Placeholder */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Navigation Route
          </h3>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            🟢 GPS Waypoint Locked
          </span>
        </div>

        <EmergencyMap heightClass="h-[280px]" highlightRequestId={request.id} />
      </div>

      {/* Requester Contact & Description */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{request.requesterName}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Requester Phone: {request.requesterPhone}
            </p>
          </div>

          <a
            href={`tel:${request.requesterPhone}`}
            className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/30 flex items-center justify-center transition-all"
            title="Call Requester"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <p><strong className="text-slate-900 dark:text-white">Situation Report:</strong> {request.description}</p>
          <p><strong className="text-slate-900 dark:text-white">Vulnerabilities:</strong> {request.peopleAffected} People (Medical: {request.medicalNeedsCount}, Children: {request.childrenCount}, Elderly: {request.elderlyCount})</p>
        </div>
      </div>

      {/* Action Progression Controls */}
      <div className="space-y-2.5 pt-2">
        <Button
          variant="outline"
          size="lg"
          onClick={handleMarkArrived}
          leftIcon={<MapPin className="w-5 h-5 text-emerald-500" />}
          className="w-full text-xs font-black uppercase py-3.5"
        >
          [ 1. MARK ARRIVED AT SCENE ]
        </Button>

        <Button
          variant="success"
          size="lg"
          onClick={() => setShowCompleteModal(true)}
          leftIcon={<CheckCircle2 className="w-5 h-5" />}
          className="w-full text-xs font-black uppercase py-3.5 shadow-xl shadow-emerald-600/30"
        >
          [ 2. ASSISTANCE COMPLETED ]
        </Button>
      </div>

      {/* Complete Assistance Confirmation Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Complete Rescue Mission
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Confirm all individuals are evacuated or safe.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Resolution Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={completedNote}
                onChange={(e) => setCompletedNote(e.target.value)}
                placeholder="e.g. 4 family members safely transferred via rescue boat to GCC Shelter #12..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="success"
                size="md"
                onClick={handleMarkCompleted}
                className="flex-1 text-xs font-black uppercase"
              >
                Confirm Done
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowCompleteModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
