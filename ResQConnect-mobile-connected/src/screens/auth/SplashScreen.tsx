import React, { useEffect } from 'react';
import { Shield, Radio, HeartHandshake, ShieldAlert } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-950 via-red-950 to-slate-950 text-white select-none animate-fadeIn">
      <div className="pt-8 text-center opacity-80">
        <span className="text-[10px] tracking-widest font-black uppercase text-red-300">
          Emergency Response Network
        </span>
      </div>

      <div className="flex flex-col items-center text-center space-y-5 animate-scaleUp">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white shadow-2xl shadow-red-600/50 border-2 border-white/20">
            <ShieldAlert className="w-14 h-14 animate-pulse" />
          </div>
          <div className="w-24 h-24 rounded-3xl bg-red-500/20 absolute inset-0 animate-ping -z-10" />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-red-100 to-rose-200 bg-clip-text text-transparent">
            RESQCONNECT
          </h1>
          <p className="text-sm font-semibold text-red-200/90 tracking-wide mt-1">
            “Connect. Respond. Protect.”
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300 font-medium pt-2">
          <span className="flex items-center gap-1">👤 Citizens</span>
          <span>•</span>
          <span className="flex items-center gap-1">🏛️ Officials</span>
          <span>•</span>
          <span className="flex items-center gap-1">🤝 Helpers</span>
        </div>
      </div>

      <div className="pb-8 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-red-500/40 border-t-red-500 rounded-full animate-spin" />
        <p className="text-[11px] text-slate-400 font-medium">Initializing secure local services...</p>
      </div>
    </div>
  );
};
