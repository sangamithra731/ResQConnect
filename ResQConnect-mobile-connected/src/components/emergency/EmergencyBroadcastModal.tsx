import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { DisasterCategory, EmergencySeverity } from '../../types/emergency';
import { INDIAN_STATES } from '../../types/common';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Radio, ShieldAlert, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { broadcastEmergency } = useEmergency();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<DisasterCategory>('Flood');
  const [severity, setSeverity] = useState<EmergencySeverity>('CRITICAL');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [targetState, setTargetState] = useState('Tamil Nadu');
  const [targetDistrict, setTargetDistrict] = useState('Chennai');
  const [targetArea, setTargetArea] = useState('South Chennai & Adyar Low Grounds');
  const [requiresAlarm, setRequiresAlarm] = useState(true);

  const [isConfirming, setIsConfirming] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const activeDistricts =
    INDIAN_STATES.find(s => s.state === targetState)?.districts || ['District HQ', 'Coastal Zone', 'Urban Core'];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setTargetState(newState);
    const districts = INDIAN_STATES.find(s => s.state === newState)?.districts;
    if (districts && districts.length > 0) {
      setTargetDistrict(districts[0]);
    }
  };

  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !headline || !description) {
      alert('Please fill out all mandatory emergency broadcast fields.');
      return;
    }
    setIsConfirming(true);
  };

  const handleExecuteBroadcast = () => {
    setIsBroadcasting(true);
    try {
      broadcastEmergency({
        title,
        type,
        severity,
        headline,
        description,
        recommendedAction,
        targetState,
        targetDistrict,
        targetArea,
        coordinates: {
          lat: 12.9815,
          lng: 80.2209,
          state: targetState,
          district: targetDistrict
        },
        issuerName: currentUser?.name || 'Dr. Rajeshwari Sundaram, IAS',
        issuerDepartment: currentUser?.department || 'State Disaster Management Authority',
        isActive: true,
        requiresAlarm
      });

      setBroadcastSuccess(true);
      setTimeout(() => {
        setBroadcastSuccess(false);
        setIsConfirming(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } finally {
      setIsBroadcasting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setHeadline('');
    setDescription('');
    setRecommendedAction('');
    setIsConfirming(false);
    setBroadcastSuccess(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isConfirming ? 'Confirm Emergency Broadcast' : 'Create & Broadcast Emergency Alert'}
      size="lg"
    >
      {broadcastSuccess ? (
        <div className="text-center py-6 space-y-3 animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Emergency Alert Broadcasted Live
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transmitted to all mobile units, local towers, citizen alarm push services, and first responder squads in {targetDistrict}, {targetState}.
          </p>
        </div>
      ) : isConfirming ? (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-500/50 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold mb-2">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>Are you sure you want to broadcast this emergency alert?</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              This action will trigger an immediate emergency alert notification and full-screen alarm on citizens' devices in{' '}
              <strong className="text-slate-900 dark:text-white">{targetDistrict}, {targetState}</strong>.
            </p>

            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-900/60 text-xs space-y-1">
              <p><span className="font-semibold text-slate-500 dark:text-slate-400">Title:</span> {title}</p>
              <p><span className="font-semibold text-slate-500 dark:text-slate-400">Severity:</span> <strong className="text-red-600 dark:text-red-400">{severity}</strong></p>
              <p><span className="font-semibold text-slate-500 dark:text-slate-400">Audible Alarm:</span> {requiresAlarm ? 'ENABLED (Loud Siren)' : 'DISABLED'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              variant="danger"
              size="lg"
              isLoading={isBroadcasting}
              onClick={handleExecuteBroadcast}
              leftIcon={<Radio className="w-5 h-5" />}
              className="flex-1 uppercase font-black tracking-wider text-sm"
            >
              [ CONFIRM & BROADCAST ]
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsConfirming(false)}
              disabled={isBroadcasting}
              className="sm:w-28"
            >
              [ CANCEL ]
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleOpenConfirmation} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alert Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FLASH FLOOD RED ALERT: Chembarambakkam Surplus"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Disaster Category *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DisasterCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="Flood">Flood</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Earthquake">Earthquake</option>
                <option value="Fire">Fire & Rescue</option>
                <option value="Landslide">Landslide</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Heatwave">Heatwave</option>
                <option value="Tsunami">Tsunami</option>
                <option value="Other">Other Disaster</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as EmergencySeverity)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="CRITICAL">🔴 CRITICAL (Immediate Danger)</option>
                <option value="HIGH">🟠 HIGH (Severe Threat)</option>
                <option value="MEDIUM">🟡 MEDIUM (Moderate Advisory)</option>
                <option value="LOW">🔵 LOW (Informational)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target State *
              </label>
              <select
                value={targetState}
                onChange={handleStateChange}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target District *
              </label>
              <select
                value={targetDistrict}
                onChange={(e) => setTargetDistrict(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {activeDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Specific Target Areas / Wards
            </label>
            <input
              type="text"
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              placeholder="e.g. Velachery, Mudichur, Jafferkhanpet, Saidapet"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Urgent Headline Message *
            </label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Inundation alert: Move to upper floors immediately."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description & Context *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the hazard conditions, water levels, evacuation routes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Recommended Action for Citizens *
            </label>
            <textarea
              required
              rows={2}
              value={recommendedAction}
              onChange={(e) => setRecommendedAction(e.target.value)}
              placeholder="e.g. Evacuate ground floor, disconnect electrical mains, call 1070 for boats..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50">
            <input
              type="checkbox"
              id="reqAlarm"
              checked={requiresAlarm}
              onChange={(e) => setRequiresAlarm(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            <label htmlFor="reqAlarm" className="text-xs font-bold text-red-900 dark:text-red-300 cursor-pointer">
              Trigger Audible Emergency Siren on Target Mobile Devices
            </label>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full uppercase font-black tracking-wider text-xs py-3"
              leftIcon={<Radio className="w-4 h-4" />}
            >
              [ BROADCAST EMERGENCY ALERT ]
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
