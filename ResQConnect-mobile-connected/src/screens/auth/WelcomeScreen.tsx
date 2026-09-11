import React from 'react';
import { Button } from '../../components/common/Button';
import { ShieldAlert, Radio, HeartHandshake, Boxes, Bell, ArrowRight, ShieldCheck } from 'lucide-react';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
  onQuickDemoLogin?: (role: 'citizen' | 'government' | 'helper') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLogin,
  onRegister,
  onQuickDemoLogin
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-900 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="pt-6 relative z-10 flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-red-100 to-rose-300 bg-clip-text text-transparent">
            ResQConnect
          </h2>
          <span className="text-[10px] text-red-300 font-bold uppercase tracking-widest">
            Disaster Management Platform
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="my-auto py-8 relative z-10 space-y-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 inline-block mb-3">
            🔴 Live Emergency Grid
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Emergency help, <br />
            <span className="bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              when you need it.
            </span>
          </h1>
          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Connecting Citizens, Government Disaster Authorities, and Verified Community First Responders in real time.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm space-y-1">
            <Radio className="w-5 h-5 text-red-400" />
            <h4 className="text-xs font-bold text-white">Real-Time Alerts</h4>
            <p className="text-[10px] text-slate-400">Audible sirens & official warnings</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm space-y-1">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Community Support</h4>
            <p className="text-[10px] text-slate-400">Vetted local first responders</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm space-y-1">
            <Boxes className="w-5 h-5 text-blue-400" />
            <h4 className="text-xs font-bold text-white">Verified Resources</h4>
            <p className="text-[10px] text-slate-400">Ambulances, shelters & food</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-sm space-y-1">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs font-bold text-white">One-Touch SOS</h4>
            <p className="text-[10px] text-slate-400">Instant coordinate dispatch</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3 pb-4 relative z-10">
        <Button
          variant="sos"
          size="lg"
          onClick={onLogin}
          className="w-full text-sm font-black tracking-wider py-3.5"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          [ LOGIN ]
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={onRegister}
          className="w-full text-white border-slate-700 hover:bg-slate-800 text-sm font-bold py-3"
        >
          [ CREATE ACCOUNT ]
        </Button>

        {/* Quick Demo Logins for instant evaluation */}
        {onQuickDemoLogin && (
          <div className="pt-2">
            <p className="text-[10px] text-center text-slate-400 font-semibold mb-2">
              ⚡ Quick Demo 1-Click Launch:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onQuickDemoLogin('citizen')}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-rose-300 border border-slate-700 flex items-center justify-center gap-1"
              >
                👤 Citizen
              </button>
              <button
                onClick={() => onQuickDemoLogin('government')}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-blue-300 border border-slate-700 flex items-center justify-center gap-1"
              >
                🏛️ Official
              </button>
              <button
                onClick={() => onQuickDemoLogin('helper')}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-300 border border-slate-700 flex items-center justify-center gap-1"
              >
                🤝 Helper
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
