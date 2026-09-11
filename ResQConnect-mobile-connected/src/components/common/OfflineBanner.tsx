import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isReconnecting, lastSyncTime, toggleNetworkSimulation, triggerManualSync } = useNetwork();

  if (isOnline && !isReconnecting) return null;

  return (
    <div className="z-30 px-3 py-2 text-xs font-semibold shadow-md transition-all">
      {isReconnecting ? (
        <div className="bg-amber-500 text-slate-950 flex items-center justify-between rounded-xl px-3 py-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Reconnecting to emergency dispatch server...</span>
          </div>
          <span className="text-[10px] opacity-80">Syncing</span>
        </div>
      ) : (
        <div className="bg-red-600 text-white flex items-center justify-between rounded-xl px-3 py-2 shadow-red-600/30">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
            <div>
              <p className="font-bold">Offline Mode Active</p>
              <p className="text-[10px] text-red-100">SOS and help requests will queue locally & sync once online. (Last synced {lastSyncTime})</p>
            </div>
          </div>
          <button
            onClick={toggleNetworkSimulation}
            className="px-2.5 py-1 bg-white/20 hover:bg-white/30 active:scale-95 rounded-lg text-[11px] font-bold shrink-0 transition-colors"
          >
            Reconnect
          </button>
        </div>
      )}
    </div>
  );
};
