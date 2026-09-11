import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/formatters';
import { AlertTriangle, Volume2, VolumeX, ShieldAlert, CheckCircle2, MapPin, Radio } from 'lucide-react';

export const FullScreenAlarmModal: React.FC = () => {
  const { activeAlarmAlert, acknowledgeAlarm } = useEmergency();
  const { currentUser } = useAuth();
  const [acknowledgedSuccess, setAcknowledgedSuccess] = useState<boolean>(false);
  const [isStopping, setIsStopping] = useState<boolean>(false);

  if (!activeAlarmAlert && !acknowledgedSuccess) return null;

  const handleAcknowledge = () => {
    setIsStopping(true);
    acknowledgeAlarm();
    setAcknowledgedSuccess(true);
    setTimeout(() => {
      setAcknowledgedSuccess(false);
      setIsStopping(false);
    }, 2500);
  };

  if (acknowledgedSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
        <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 text-center max-w-sm w-full shadow-2xl animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-500/40 animate-bounce-subtle">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight mb-1">Alert Acknowledged</h3>
          <p className="text-xs text-slate-300 mb-4">
            Telemetry logged. State Emergency Operations Center has recorded your acknowledgement.
          </p>
          <div className="bg-slate-800/80 rounded-xl p-3 text-left text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Recipient:</span>
              <span className="font-semibold text-white">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Logged At:</span>
              <span className="font-semibold text-white">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-emerald-400">TELEMETRY_RECORDED</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!activeAlarmAlert) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-red-950 via-slate-950 to-red-950 text-white animate-fadeIn overflow-y-auto">
      {/* Flashing Top Emergency Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/30 border-2 border-red-500 text-red-300 text-xs font-black tracking-widest uppercase animate-pulse">
          <Radio className="w-4 h-4 text-red-400 animate-spin" />
          <span>🚨🚨 CRITICAL EMERGENCY ALERT 🚨🚨</span>
        </div>
      </div>

      {/* Main Alert Body */}
      <div className="my-auto max-w-md mx-auto w-full py-4 text-center">
        {/* Pulsing Alarm Indicator */}
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-red-600/30 animate-ping absolute inset-0" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-rose-700 border-4 border-white/20 flex items-center justify-center text-white shadow-2xl shadow-red-600 relative z-10">
            <Volume2 className="w-12 h-12 animate-pulse" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-black uppercase mb-3 border border-red-500/40">
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 ALARM ACTIVE — MANUAL ACKNOWLEDGEMENT REQUIRED</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase mb-2 text-red-50 drop-shadow-md">
          {activeAlarmAlert.title}
        </h2>

        <div className="flex items-center justify-center gap-1.5 text-xs text-red-300 font-bold mb-4">
          <MapPin className="w-4 h-4" />
          <span>
            {activeAlarmAlert.targetDistrict}, {activeAlarmAlert.targetState}
          </span>
        </div>

        <div className="bg-red-900/40 border-2 border-red-500/60 rounded-2xl p-4 text-left mb-4 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-bold text-red-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Immediate Action Required
          </p>
          <p className="text-sm font-semibold text-white leading-relaxed mb-3">
            {activeAlarmAlert.headline}
          </p>
          <p className="text-xs text-red-200/90 leading-relaxed border-t border-red-500/30 pt-2">
            <span className="font-bold text-white">Instructions:</span> {activeAlarmAlert.recommendedAction}
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-2.5 text-[11px] text-slate-300 flex items-center justify-between border border-slate-800">
          <span>Broadcast Authority:</span>
          <span className="font-bold text-white">{activeAlarmAlert.issuerName}</span>
        </div>
      </div>

      {/* Mandatory Acknowledge & Stop Button */}
      <div className="max-w-md mx-auto w-full pt-2 pb-4">
        <button
          onClick={handleAcknowledge}
          disabled={isStopping}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] text-white font-black text-base uppercase tracking-wider shadow-2xl shadow-red-600/60 border-2 border-white/30 flex items-center justify-center gap-3 transition-all animate-bounce-subtle cursor-pointer"
        >
          <VolumeX className="w-6 h-6" />
          <span>[ ACKNOWLEDGE & STOP ALARM ]</span>
        </button>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          Stopping the alarm records your safety status & location confirmation with emergency command.
        </p>
      </div>
    </div>
  );
};
