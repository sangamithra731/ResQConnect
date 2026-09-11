import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import { INDIAN_STATES } from '../../types/common';
import { Button } from '../../components/common/Button';
import { ShieldCheck, User, Mail, Phone, Lock, MapPin, ArrowLeft, CheckCircle2, Heart } from 'lucide-react';

interface RegisterScreenProps {
  initialRole: UserRole;
  onBack: () => void;
  onGoToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  initialRole,
  onBack,
  onGoToLogin,
  onRegisterSuccess
}) => {
  const { register, isLoading } = useAuth();

  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [district, setDistrict] = useState('Chennai');
  const [cityArea, setCityArea] = useState('Velachery');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const activeDistricts =
    INDIAN_STATES.find(s => s.state === state)?.districts || ['Chennai', 'Central', 'Urban HQ'];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setState(newState);
    const districts = INDIAN_STATES.find(s => s.state === newState)?.districts;
    if (districts && districts.length > 0) {
      setDistrict(districts[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName || !phone || !email || !password) {
      setErrorMsg('Please fill in all mandatory account fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('You must accept the emergency response terms & conditions.');
      return;
    }

    try {
      await register({
        name: fullName,
        phone,
        email,
        role,
        state,
        district,
        city: cityArea,
        emergencyContacts: emergencyContactName && emergencyContactPhone ? [
          {
            id: `ec-${Date.now()}`,
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: 'Family Member',
            isPrimary: true
          }
        ] : []
      });

      setSuccessMsg(true);
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch {
      setErrorMsg('Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 bg-slate-900 text-white max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-lg font-black text-white">Create ResQConnect Account</h2>
          <p className="text-xs text-slate-400">Step 2: Profile & Verification Setup</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="my-auto py-6">
        {successMsg ? (
          <div className="text-center py-10 space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Account Created Successfully</h3>
            <p className="text-xs text-slate-300">
              Redirecting you to your {role === 'government' ? 'Government Command Dashboard' : role === 'helper' ? 'Helper Dashboard' : 'Citizen Dashboard'}...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Role Badge selector */}
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Selected Role:</span>
                <p className="text-xs font-bold text-white capitalize">{role}</p>
              </div>
              <div className="flex gap-1">
                {(['citizen', 'government', 'helper'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      role === r
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {r === 'government' ? 'Gov' : r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Mobile Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401..."
                    className="w-full pl-8 pr-2.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@mail.com"
                    className="w-full pl-8 pr-2.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-300 mb-1">State *</label>
                <select
                  value={state}
                  onChange={handleStateChange}
                  className="w-full px-2 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-[11px] font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.state} value={s.state}>{s.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">District *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-[11px] font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {activeDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">City / Area *</label>
                <input
                  type="text"
                  required
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder="e.g. Velachery"
                  className="w-full px-2.5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-white text-[11px] font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 space-y-2">
              <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Primary Emergency Contact
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Contact Name (e.g. Mother)"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white text-[11px] focus:outline-none"
                />
                <input
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="Contact Phone (+91...)"
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white text-[11px] focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-slate-300 pt-1">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-800 border-slate-700 mt-0.5"
              />
              <span>
                I agree to the ResQConnect Emergency Response Terms, telemetry sharing for disaster coordination, and safety protocols.
              </span>
            </label>

            <div className="pt-2">
              <Button
                type="submit"
                variant="danger"
                size="lg"
                isLoading={isLoading}
                className="w-full text-sm font-black tracking-wider py-3.5 uppercase"
              >
                [ CREATE ACCOUNT ]
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="text-red-400 hover:underline font-bold">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
