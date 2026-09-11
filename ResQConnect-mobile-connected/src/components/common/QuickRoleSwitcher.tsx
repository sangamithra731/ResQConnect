import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import { User, ShieldCheck, HeartHandshake } from 'lucide-react';

interface QuickRoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

export const QuickRoleSwitcher: React.FC<QuickRoleSwitcherProps> = ({ onRoleChange }) => {
  const { role, switchRole } = useAuth();

  const handleSelectRole = (newRole: UserRole) => {
    switchRole(newRole);
    if (onRoleChange) onRoleChange(newRole);
  };

  return (
    <div className="bg-slate-900 text-white px-3 py-2 border-b border-slate-800 text-xs flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-[11px] text-slate-300">DEMO SWITCHER:</span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
        <button
          onClick={() => handleSelectRole('citizen')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 ${
            role === 'citizen'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 font-bold'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Citizen</span>
        </button>

        <button
          onClick={() => handleSelectRole('government')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 ${
            role === 'government'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gov Official</span>
        </button>

        <button
          onClick={() => handleSelectRole('helper')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all shrink-0 ${
            role === 'helper'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Verified Helper</span>
        </button>
      </div>
    </div>
  );
};
