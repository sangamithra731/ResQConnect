import React from 'react';
import { UserRole } from '../../types/user';
import { User, ShieldAlert, HeartHandshake, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface RoleSelectScreenProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  selectedRole,
  onSelectRole,
  onContinue,
  onBack
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-900 text-white max-w-md mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-black text-white">Choose Your Role</h2>
          <p className="text-xs text-slate-400">Step 1 of 2: Account Purpose</p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="my-auto py-6 space-y-3.5">
        {/* Citizen Card */}
        <div
          onClick={() => onSelectRole('citizen')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedRole === 'citizen'
              ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-900/30'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl border border-rose-500/30">
                👤
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Citizen</h3>
                <p className="text-xs text-slate-400">General Public & Residents</p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                selectedRole === 'citizen'
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'border-slate-600'
              }`}
            >
              {selectedRole === 'citizen' && <Check className="w-4 h-4" />}
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Receive emergency sirens & alerts, request urgent rescue assistance, locate nearby shelters, and donate to verified relief funds.
          </p>
        </div>

        {/* Government Official Card */}
        <div
          onClick={() => onSelectRole('government')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedRole === 'government'
              ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-900/30'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl border border-blue-500/30">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Government Official</h3>
                </div>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⚠️ Verification Required
                </span>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                selectedRole === 'government'
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'border-slate-600'
              }`}
            >
              {selectedRole === 'government' && <Check className="w-4 h-4" />}
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Command Center access: broadcast siren warnings, manage disaster relief logistics, assign ambulances/rescue teams, and monitor donation telemetry.
          </p>
        </div>

        {/* Helper / Activist Card */}
        <div
          onClick={() => onSelectRole('helper')}
          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedRole === 'helper'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-900/30'
              : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/30">
                🤝
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Helper / Activist</h3>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⚠️ Verification Required
                </span>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                selectedRole === 'helper'
                  ? 'bg-emerald-500 border-emerald-400 text-white'
                  : 'border-slate-600'
              }`}
            >
              {selectedRole === 'helper' && <Check className="w-4 h-4" />}
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            Volunteers, EMTs, NDRF alumni & community leaders: toggle live availability, accept nearby rescue missions, and provide on-ground relief.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pb-4">
        <Button
          variant={selectedRole === 'government' ? 'primary' : selectedRole === 'helper' ? 'success' : 'danger'}
          size="lg"
          onClick={onContinue}
          className="w-full text-sm font-black tracking-wider py-3.5"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Continue as {selectedRole === 'citizen' ? 'Citizen' : selectedRole === 'government' ? 'Government Official' : 'Helper'}
        </Button>
      </div>
    </div>
  );
};
