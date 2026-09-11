import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import {
  Settings,
  Bell,
  Volume2,
  Moon,
  MapPin,
  Shield,
  AlertTriangle,
  ArrowLeft,
  Home as HomeIcon,
  Smartphone,
  Lock
} from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
  onExitToHome?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onExitToHome }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();

  // Notification toggles
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [helpRequestUpdates, setHelpRequestUpdates] = useState(true);
  const [govUpdates, setGovUpdates] = useState(true);
  const [donationUpdates, setDonationUpdates] = useState(true);
  const [helperNotifications, setHelperNotifications] = useState(true);

  // Emergency sound toggles
  const [emergencyAlarmSound, setEmergencyAlarmSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [flashAlert, setFlashAlert] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Location toggles
  const [locationSharing, setLocationSharing] = useState(true);
  const [nearbyHelp, setNearbyHelp] = useState(true);

  // Privacy toggles
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activitySharing, setActivitySharing] = useState(true);

  // Warning Modal for disabling critical alerts
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingDisableAction, setPendingDisableAction] = useState<(() => void) | null>(null);

  const handleToggleCriticalAlert = (currentVal: boolean, setter: (v: boolean) => void) => {
    if (currentVal) {
      setPendingDisableAction(() => () => setter(false));
      setShowWarningModal(true);
    } else {
      setter(true);
    }
  };

  const confirmDisableAction = () => {
    if (pendingDisableAction) pendingDisableAction();
    setShowWarningModal(false);
    setPendingDisableAction(null);
  };

  const handleExit = () => {
    if (onExitToHome) onExitToHome();
    else onBack();
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header with Exit to Home */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              System Preferences
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Settings & Safety Controls
            </h2>
          </div>
        </div>

        <button
          onClick={handleExit}
          className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
          title="Exit to Home"
        >
          <HomeIcon className="w-3.5 h-3.5 text-blue-500" />
          <span>Exit Home</span>
        </button>
      </div>

      {/* Emergency Audio & Siren Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <Volume2 className="w-5 h-5" />
          <h3 className="text-xs font-black uppercase tracking-wider">Emergency Alarm Settings</h3>
        </div>

        <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Emergency Danger Siren</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Audible high-urgency danger tone on critical alerts
              </p>
            </div>
            <ToggleSwitch
              checked={emergencyAlarmSound}
              onChange={() => handleToggleCriticalAlert(emergencyAlarmSound, setEmergencyAlarmSound)}
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Vibration Haptics</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Continuous pulse pattern during active alarms
              </p>
            </div>
            <ToggleSwitch checked={vibration} onChange={() => setVibration(!vibration)} />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Camera LED Flash Alert</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Flash strobe indicator for low-light emergencies
              </p>
            </div>
            <ToggleSwitch checked={flashAlert} onChange={() => setFlashAlert(!flashAlert)} />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">General Sound Effects</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                App feedback beeps and status alerts
              </p>
            </div>
            <ToggleSwitch checked={soundEffects} onChange={() => setSoundEffects(!soundEffects)} />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Bell className="w-5 h-5" />
          <h3 className="text-xs font-black uppercase tracking-wider">Notification Channels</h3>
        </div>

        <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Disaster Emergency Alerts</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                High-priority life safety broadcasts
              </p>
            </div>
            <ToggleSwitch
              checked={emergencyAlerts}
              onChange={() => handleToggleCriticalAlert(emergencyAlerts, setEmergencyAlerts)}
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Help Request Updates</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Live responder tracking & status change alerts
              </p>
            </div>
            <ToggleSwitch checked={helpRequestUpdates} onChange={() => setHelpRequestUpdates(!helpRequestUpdates)} />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">TNSDMA Government Bulletins</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Advisories, shelter announcements, cyclone updates
              </p>
            </div>
            <ToggleSwitch checked={govUpdates} onChange={() => setGovUpdates(!govUpdates)} />
          </div>
        </div>
      </div>

      {/* Location & GPS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <MapPin className="w-5 h-5" />
          <h3 className="text-xs font-black uppercase tracking-wider">Location & Geo-Safety</h3>
        </div>

        <div className="space-y-3 text-xs divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Emergency GPS Sharing</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Share coordinates with emergency rescue squads
              </p>
            </div>
            <ToggleSwitch checked={locationSharing} onChange={() => setLocationSharing(!locationSharing)} />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Nearby Help Beacon</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Allow nearby verified volunteers to locate distress signals
              </p>
            </div>
            <ToggleSwitch checked={nearbyHelp} onChange={() => setNearbyHelp(!nearbyHelp)} />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-500">
          <Moon className="w-5 h-5" />
          <h3 className="text-xs font-black uppercase tracking-wider">Appearance</h3>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              High-contrast theme for emergency situations
            </p>
          </div>
          <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} />
        </div>
      </div>

      {/* Critical Safety Alert Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border-2 border-red-500 shadow-2xl space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                ⚠️ Warning: Disabling Critical Alerts
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                “Disabling emergency alerts may prevent you from receiving critical safety information during life-threatening natural disasters.”
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowWarningModal(false)}
                className="w-full text-xs font-bold"
              >
                Keep Emergency Alerts Enabled (Recommended)
              </Button>

              <Button
                variant="danger"
                size="md"
                onClick={confirmDisableAction}
                className="w-full text-xs"
              >
                Disable Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
