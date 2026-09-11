import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ShieldAlert, Eye, EyeOff, Lock, Mail, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onBack: () => void;
  onGoToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onGoToRegister,
  onLoginSuccess
}) => {
  const { login, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) {
      setErrorMsg('Please enter your email address or mobile number.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    try {
      await login(identifier, password);
      onLoginSuccess();
    } catch {
      setErrorMsg('Invalid login credentials. Please check your details.');
    }
  };

  const handleQuickFill = (role: 'citizen' | 'government' | 'helper') => {
    if (role === 'citizen') {
      setIdentifier('aarav.sharma@example.com');
      setPassword('CitizenPass2026!');
    } else if (role === 'government') {
      setIdentifier('authority@riskintel.local');
      setPassword('riskintel123');
    } else {
      setIdentifier('vikram.rathore@resqvolunteers.org');
      setPassword('HelperRescue2026!');
    }
    setErrorMsg(null);
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
          <h2 className="text-lg font-black text-white">Sign In to ResQConnect</h2>
          <p className="text-xs text-slate-400">Secure Emergency Response Login</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="my-auto py-6 space-y-5">
        {/* Brand Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-red-600/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs text-red-300 font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Email / Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="aarav@example.com or +91 98401..."
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-800 text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none placeholder:text-slate-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-800 border-slate-700"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => alert('Password reset link sent to your registered email / mobile number.')}
              className="text-red-400 hover:underline font-bold text-[11px]"
            >
              Forgot Password?
            </button>
          </div>

          <div className="pt-2 space-y-2.5">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              isLoading={isLoading}
              className="w-full text-sm font-black tracking-wider py-3.5 uppercase"
            >
              [ LOGIN ]
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setIdentifier('+91 98401 23456');
                alert('OTP sent to +91 98401 23456 (Mock verified)');
                login('+91 98401 23456').then(onLoginSuccess);
              }}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold py-3"
              leftIcon={<Phone className="w-4 h-4" />}
            >
              [ CONTINUE WITH PHONE ]
            </Button>
          </div>
        </form>

        {/* Quick Demo Selector */}
        <div className="pt-2 border-t border-slate-800">
          <p className="text-[10px] text-slate-400 text-center font-bold mb-2 uppercase tracking-wider">
            Demo Credentials Quick Fill:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickFill('citizen')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-rose-300 border border-slate-700"
            >
              Aarav (Citizen)
            </button>
            <button
              onClick={() => handleQuickFill('government')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-blue-300 border border-slate-700"
            >
              Dr. Sundaram (Gov)
            </button>
            <button
              onClick={() => handleQuickFill('helper')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-emerald-300 border border-slate-700"
            >
              Vikram (Helper)
            </button>
          </div>
        </div>
      </div>

      {/* Footer Link */}
      <div className="text-center pb-4 pt-2">
        <p className="text-xs text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={onGoToRegister}
            className="text-red-400 hover:underline font-bold"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
};
