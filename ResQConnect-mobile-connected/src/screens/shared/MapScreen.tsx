import React from 'react';
import { EmergencyMap } from '../../components/map/EmergencyMap';
import { MapPin, Navigation, Compass, Layers, ShieldCheck, Home as HomeIcon, ArrowLeft } from 'lucide-react';

interface MapScreenProps {
  onBack?: () => void;
  onExitToHome?: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onBack, onExitToHome }) => {
  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Exit to Home */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              State Geospatial Grid
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Emergency Map
            </h2>
          </div>
        </div>

        {onExitToHome && (
          <button
            onClick={onExitToHome}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
            title="Exit to Home"
          >
            <HomeIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Exit Home</span>
          </button>
        )}
      </div>

      <EmergencyMap heightClass="h-[500px]" />
    </div>
  );
};
