import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNetwork } from '../../context/NetworkContext';
import { notificationService } from '../../services/notificationService';
import { Shield, Bell, Moon, Sun, Wifi, WifiOff, Smartphone, Laptop, Home as HomeIcon } from 'lucide-react';

interface TopHeaderProps {
  onOpenNotifications: () => void;
  onGoHome?: () => void;
  title?: string;
  subtitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenNotifications,
  onGoHome,
  title,
  subtitle
}) => {
  const { currentUser, role } = useAuth();
  const { isDarkMode, toggleDarkMode, isDeviceFrame, toggleDeviceFrame } = useTheme();
  const { isOnline, toggleNetworkSimulation } = useNetwork();
  const unreadCount = notificationService.getUnreadCount();

  const getRoleBadge = () => {
    switch (role) {
      case 'government':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            🏛️ OFFICIAL
          </span>
        );
      case 'helper':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            🤝 HELPER
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            👤 CITIZEN
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Logo / Brand or Dynamic Title with click to go home */}
        <div
          onClick={onGoHome}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none group"
          title="Go to Home Dashboard"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-md shadow-red-600/30 shrink-0 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            {title ? (
              <>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight flex items-center gap-1.5">
                  {title} {getRoleBadge()}
                </h1>
                {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>}
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                    ResQConnect
                  </span>
                  {getRoleBadge()}
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {currentUser ? `${currentUser.city}, ${currentUser.state}` : 'Emergency Response Platform'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Direct Home Button in Header */}
          {onGoHome && (
            <button
              onClick={onGoHome}
              title="Return to Home Dashboard"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
            </button>
          )}

          {/* Network Simulator Toggle */}
          <button
            onClick={toggleNetworkSimulation}
            title={isOnline ? 'Simulate Poor / Offline Network' : 'Network Offline (Click to Reconnect)'}
            className={`p-2 rounded-xl transition-all ${
              isOnline
                ? 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={toggleDeviceFrame}
            title={isDeviceFrame ? 'Switch to Fullscreen Responsive Mode' : 'Switch to Mobile Frame Showcase Mode'}
            className="hidden sm:inline-flex p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDeviceFrame ? <Laptop className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 border-2 border-white dark:border-slate-900 rounded-full animate-ping-slow" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
