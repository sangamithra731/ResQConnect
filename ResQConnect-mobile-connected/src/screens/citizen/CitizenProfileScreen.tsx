import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Edit3,
  Award,
  Building,
  HeartHandshake,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface CitizenProfileScreenProps {
  onOpenSettings: () => void;
  onOpenEmergencyContacts: () => void;
  onLogout: () => void;
}

export const CitizenProfileScreen: React.FC<CitizenProfileScreenProps> = ({
  onOpenSettings,
  onOpenEmergencyContacts,
  onLogout
}) => {
  const { currentUser, updateProfile, switchRole } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [area, setArea] = useState(currentUser?.area || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, email, city, area });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Profile Hero Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-md"
              />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 absolute -bottom-1 -right-1" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                {currentUser?.name}
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {currentUser?.role === 'government'
                  ? 'Government Disaster Official'
                  : currentUser?.role === 'helper'
                  ? 'Verified Community First Responder'
                  : 'Citizen / Resident'}
              </p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {currentUser?.verificationBadge || 'Aadhaar Verified'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setName(currentUser?.name || '');
              setPhone(currentUser?.phone || '');
              setEmail(currentUser?.email || '');
              setCity(currentUser?.city || '');
              setArea(currentUser?.area || '');
              setIsEditModalOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* User Details Grid */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser?.phone}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser?.email}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentUser?.city}, {currentUser?.district}, {currentUser?.state}
            </span>
          </div>
        </div>
      </div>

      {/* Role Switcher Section in Profile */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Switch User Experience (Demo Evaluation)
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => switchRole('citizen')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
              currentUser?.role === 'citizen'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-black'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <User className="w-5 h-5 text-rose-500" />
            <span className="text-[11px]">Citizen</span>
          </button>

          <button
            onClick={() => switchRole('government')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
              currentUser?.role === 'government'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 font-black'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building className="w-5 h-5 text-blue-500" />
            <span className="text-[11px]">Gov Official</span>
          </button>

          <button
            onClick={() => switchRole('helper')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
              currentUser?.role === 'helper'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-black'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <HeartHandshake className="w-5 h-5 text-emerald-500" />
            <span className="text-[11px]">Helper</span>
          </button>
        </div>
      </div>

      {/* Profile Links & Navigation Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <button
          onClick={onOpenEmergencyContacts}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Emergency SOS Contacts</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {currentUser?.emergencyContacts.length || 0} Contacts configured
              </p>
            </div>
          </div>
          <span className="text-slate-400 font-bold">›</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Settings & Safety Controls</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Alarms, haptics, dark mode, location
              </p>
            </div>
          </div>
          <span className="text-slate-400 font-bold">›</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full p-3.5 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-colors text-left text-red-600 dark:text-red-400 font-bold"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-600 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <h4>Log Out Session</h4>
              <p className="text-[10px] text-slate-400">Sign out of this device</p>
            </div>
          </div>
          <span>›</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
      >
        <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Area / Street
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full text-xs font-black uppercase py-3"
            >
              Update Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
