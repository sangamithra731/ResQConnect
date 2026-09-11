import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  AlertTriangle,
  LifeBuoy,
  User,
  Radio,
  MapPin,
  Clock,
  LayoutDashboard,
  Boxes,
  HeartHandshake,
  FileSpreadsheet
} from 'lucide-react';

export type NavTab =
  | 'home'
  | 'alerts'
  | 'resources'
  | 'sos'
  | 'profile'
  | 'requests'
  | 'map'
  | 'history'
  | 'dashboard'
  | 'emergencies'
  | 'donations';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSOSModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSOSModal
}) => {
  const { role } = useAuth();

  if (role === 'helper') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 max-w-lg mx-auto transition-colors">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Home</span>
          </button>

          <button
            onClick={() => onSelectTab('requests')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'requests'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Requests</span>
          </button>

          <button
            onClick={() => onSelectTab('map')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'map'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Map</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'history'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">History</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              currentTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </button>
        </div>
      </nav>
    );
  }

  if (role === 'government') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 max-w-lg mx-auto transition-colors">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
              currentTab === 'dashboard'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Dashboard</span>
          </button>

          <button
            onClick={() => onSelectTab('emergencies')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
              currentTab === 'emergencies'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Alerts</span>
          </button>

          <button
            onClick={() => onSelectTab('resources')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
              currentTab === 'resources'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <Boxes className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Resources</span>
          </button>

          <button
            onClick={() => onSelectTab('donations')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
              currentTab === 'donations'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Donations</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
              currentTab === 'profile'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">Profile</span>
          </button>
        </div>
      </nav>
    );
  }

  // Citizen Navigation (with floating SOS button)
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 max-w-lg mx-auto transition-colors">
      <div className="flex items-center justify-between relative">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'home'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onSelectTab('alerts')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'alerts'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Alerts</span>
        </button>

        {/* Floating Center SOS Button */}
        <div className="relative -top-5 flex flex-col items-center">
          <button
            onClick={onOpenSOSModal}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white flex items-center justify-center font-black text-xs shadow-xl shadow-red-600/50 border-4 border-white dark:border-slate-900 hover:scale-105 active:scale-95 transition-transform animate-bounce-subtle"
            aria-label="Instant SOS"
          >
            SOS
          </button>
          <span className="text-[9px] font-extrabold text-red-600 dark:text-red-400 tracking-wider uppercase mt-0.5">
            EMERGENCY
          </span>
        </div>

        <button
          onClick={() => onSelectTab('resources')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'resources'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <LifeBuoy className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Resources</span>
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
            currentTab === 'profile'
              ? 'text-red-600 dark:text-red-400 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
