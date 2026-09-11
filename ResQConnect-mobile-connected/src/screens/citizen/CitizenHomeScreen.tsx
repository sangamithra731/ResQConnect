import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { AlertCard } from '../../components/emergency/AlertCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { EmergencyAlert } from '../../types/emergency';
import { HelpRequest } from '../../types/helpRequest';
import { formatCompactINR } from '../../utils/formatters';
import { MOCK_CAMPAIGNS } from '../../services/mockData';
import {
  ShieldCheck,
  MapPin,
  AlertTriangle,
  LifeBuoy,
  HeartHandshake,
  Heart,
  PhoneCall,
  Radio,
  ArrowRight,
  Sparkles,
  Volume2,
  Share2,
  Clock
} from 'lucide-react';

interface CitizenHomeScreenProps {
  onOpenSOSModal: () => void;
  onNavigateToTab: (tab: any) => void;
  onOpenHelpRequestForm: () => void;
  onOpenAlertDetails: (alert: EmergencyAlert) => void;
  onOpenRequestTracking: (request: HelpRequest) => void;
  onOpenDonationCampaign: (campaignId: string) => void;
  onOpenEmergencyContacts: () => void;
}

export const CitizenHomeScreen: React.FC<CitizenHomeScreenProps> = ({
  onOpenSOSModal,
  onNavigateToTab,
  onOpenHelpRequestForm,
  onOpenAlertDetails,
  onOpenRequestTracking,
  onOpenDonationCampaign,
  onOpenEmergencyContacts
}) => {
  const { currentUser } = useAuth();
  const { activeAlerts, activeSOSRequest, triggerAlarm } = useEmergency();

  const primaryAlert = activeAlerts.find(a => a.severity === 'CRITICAL') || activeAlerts[0];
  const featuredCampaign = MOCK_CAMPAIGNS[0];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Greeting & Safety Status Bar */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 tracking-wide uppercase">
              {getTimeGreeting()},
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentUser?.name.split(' ')[0] || 'Citizen'}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate font-semibold">
                {currentUser?.city || 'Velachery'}, {currentUser?.district || 'Chennai'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              🟢 You are safe
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Monitoring live grid</span>
          </div>
        </div>
      </div>

      {/* Active SOS Tracker Banner if one exists */}
      {activeSOSRequest && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-4 shadow-xl shadow-red-600/30 border border-red-400/40 animate-pulse-fast">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <Radio className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-200">
                  Active Emergency Mission
                </span>
                <h3 className="text-sm font-black">Help Request #{activeSOSRequest.id}</h3>
                <p className="text-[11px] text-red-100">
                  Status: <strong className="uppercase">{activeSOSRequest.status}</strong>
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => onOpenRequestTracking(activeSOSRequest)}
              className="bg-white text-red-700 hover:bg-red-50 text-xs font-black shrink-0"
            >
              Track Live
            </Button>
          </div>
        </div>
      )}

      {/* Hero SOS Button Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-900 via-rose-950 to-slate-900 rounded-3xl p-5 text-white shadow-2xl border border-red-500/30">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10 gap-3">
          <div className="space-y-1 max-w-[65%]">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-300">
              <Radio className="w-3 h-3 text-red-400 animate-ping" /> Instant Rescue
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              In Danger? Trigger SOS
            </h3>
            <p className="text-xs text-red-200/90 leading-snug">
              Instantly sends GPS coordinates to command HQ & nearby rescue boats.
            </p>
          </div>

          <button
            onClick={onOpenSOSModal}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white flex flex-col items-center justify-center font-black text-sm shadow-2xl shadow-red-600/60 border-4 border-white/40 hover:scale-105 active:scale-95 transition-transform animate-bounce-subtle shrink-0 cursor-pointer"
          >
            <span className="text-lg tracking-wider">🆘</span>
            <span className="text-xs tracking-widest font-black">SOS</span>
          </button>
        </div>
      </div>

      {/* Main Section: 🚨 ACTIVE EMERGENCIES */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              🚨 ACTIVE EMERGENCIES ({activeAlerts.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigateToTab('alerts')}
            className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {primaryAlert ? (
          <AlertCard
            alert={primaryAlert}
            onViewDetails={onOpenAlertDetails}
            onTestAlarm={triggerAlarm}
          />
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active disaster alarms in your zone.</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Your area is under normal monitoring.</p>
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Emergency Services & Actions
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Detailed Help Request Button */}
          <button
            onClick={onOpenHelpRequestForm}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 shadow-sm text-left flex flex-col justify-between space-y-3 transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Request Help</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Medical, Fire, Flood, Food & Evac
              </p>
            </div>
          </button>

          {/* Nearby Resources */}
          <button
            onClick={() => onNavigateToTab('resources')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-sm text-left flex flex-col justify-between space-y-3 transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Nearby Resources</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ambulances, Shelters & Hospitals
              </p>
            </div>
          </button>

          {/* Verified Helpers */}
          <button
            onClick={() => onNavigateToTab('resources')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-sm text-left flex flex-col justify-between space-y-3 transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Find Helpers</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Verified EMTs & First Responders
              </p>
            </div>
          </button>

          {/* Emergency Contacts */}
          <button
            onClick={onOpenEmergencyContacts}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 shadow-sm text-left flex flex-col justify-between space-y-3 transition-all active:scale-[0.98] group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Emergency Contacts</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Family SOS & Local Helplines
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Featured Verified Relief Campaign */}
      {featuredCampaign && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-amber-950/30 dark:to-slate-900 rounded-3xl p-4 sm:p-5 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 tracking-wider">
                  💰 Verified Relief Campaign
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {featuredCampaign.title}
                </h4>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              URGENT
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                Raised: {formatCompactINR(featuredCampaign.raisedAmount)}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Goal: {formatCompactINR(featuredCampaign.goalAmount)}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (featuredCampaign.raisedAmount / featuredCampaign.goalAmount) * 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>{featuredCampaign.donorsCount.toLocaleString()} Donors</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {Math.round((featuredCampaign.raisedAmount / featuredCampaign.goalAmount) * 100)}% Funded
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => onOpenDonationCampaign(featuredCampaign.id)}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-xs py-2 shadow-md shadow-amber-600/20"
          >
            Donate Now (₹100, ₹500, ₹1000+)
          </Button>
        </div>
      )}
    </div>
  );
};
