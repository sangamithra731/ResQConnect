import React, { useState, useRef } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { EmergencyRequestType, HelpRequest } from '../../types/helpRequest';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  Home as HomeIcon,
  Waves,
  Activity,
  LifeBuoy,
  Utensils,
  Home,
  UserX,
  Plus,
  Minus,
  MapPin,
  Camera,
  Mic,
  Send,
  CheckCircle2,
  X,
  Wind
} from 'lucide-react';

interface HelpRequestFormScreenProps {
  onBack: () => void;
  onExitToHome?: () => void;
  onSuccessNavigateToTracking: (request: HelpRequest) => void;
}

export const HelpRequestFormScreen: React.FC<HelpRequestFormScreenProps> = ({
  onBack,
  onExitToHome,
  onSuccessNavigateToTracking
}) => {
  const { createHelpRequest } = useEmergency();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filtered emergency types as requested:
  // Removed: Fire, Accident, Earthquake, Drinking Water
  // Renamed: "Cyclone" (without "/storm")
  const [emergencyType, setEmergencyType] = useState<EmergencyRequestType>('Flood');
  const [peopleAffected, setPeopleAffected] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [elderlyCount, setElderlyCount] = useState<number>(1);
  const [medicalNeedsCount, setMedicalNeedsCount] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<HelpRequest | null>(null);

  const emergencyCategories: { type: EmergencyRequestType; label: string; icon: string }[] = [
    { type: 'Medical', label: 'Medical', icon: '🚑' },
    { type: 'Flood', label: 'Flood', icon: '🌊' },
    { type: 'Cyclone', label: 'Cyclone', icon: '🌀' },
    { type: 'Rescue', label: 'Rescue', icon: '🛟' },
    { type: 'Food', label: 'Food', icon: '🍱' },
    { type: 'Shelter', label: 'Shelter', icon: '🏠' },
    { type: 'Missing Person', label: 'Missing Person', icon: '🔍' },
    { type: 'Other', label: 'Other', icon: '🆘' }
  ];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setVoiceDuration(0);
      const interval = setInterval(() => {
        setVoiceDuration(prev => {
          if (prev >= 15) {
            clearInterval(interval);
            setIsRecordingVoice(false);
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please describe your emergency situation.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Default priority is set automatically in backend/service
      const req = await createHelpRequest({
        emergencyType,
        priority: 'CRITICAL',
        peopleAffected: Math.max(1, peopleAffected),
        childrenCount: Math.max(0, childrenCount),
        elderlyCount: Math.max(0, elderlyCount),
        medicalNeedsCount: Math.max(0, medicalNeedsCount),
        description,
        photoUrl: photoPreview || undefined,
        voiceNoteDurationSec: voiceDuration > 0 ? voiceDuration : undefined
      });

      setSubmittedRequest(req);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (onExitToHome) onExitToHome();
    else onBack();
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Exit to Home Button */}
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
            <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
              State Emergency Dispatch
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Request Emergency Help
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExit}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          title="Exit to Home"
        >
          <HomeIcon className="w-3.5 h-3.5 text-rose-500" />
          <span>Exit Home</span>
        </button>
      </div>

      {submittedRequest ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg text-center space-y-4 animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Help Request Submitted Successfully
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your request #{submittedRequest.id} is queued in the State Operations Triage Center.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Category:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedRequest.emergencyType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">People Requiring Help:</span>
              <span className="font-bold text-slate-900 dark:text-white">{submittedRequest.peopleAffected} persons</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onSuccessNavigateToTracking(submittedRequest)}
              className="w-full text-xs font-black uppercase"
            >
              Track Live Response Timeline
            </Button>
            <Button variant="outline" onClick={handleExit} className="w-full text-xs">
              Exit to Home Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Emergency Type Selection Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              1. Select Emergency Type *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {emergencyCategories.map(cat => (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => setEmergencyType(cat.type)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    emergencyType === cat.type
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 font-bold shadow-md shadow-red-500/10'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[10px] font-bold leading-tight truncate w-full">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. People Affected & Medical Vulnerabilities */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              2. People Affected & Medical Vulnerabilities *
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Total People Input */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Total People</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Needing rescue/aid</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPeopleAffected(prev => Math.max(1, (prev || 1) - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 1)}
                    className="w-10 text-center font-black text-sm bg-transparent text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setPeopleAffected(prev => (prev || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Input */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Children</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Under 12 years</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setChildrenCount(prev => Math.max(0, (prev || 0) - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                    className="w-10 text-center font-black text-sm bg-transparent text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setChildrenCount(prev => (prev || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Elderly Input */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Elderly</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Senior citizens (60+)</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setElderlyCount(prev => Math.max(0, (prev || 0) - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={elderlyCount}
                    onChange={(e) => setElderlyCount(parseInt(e.target.value) || 0)}
                    className="w-10 text-center font-black text-sm bg-transparent text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setElderlyCount(prev => (prev || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Medical Needs Input */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Medical Needs</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Oxygen, insulin, trauma</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMedicalNeedsCount(prev => Math.max(0, (prev || 0) - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-900 dark:text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={medicalNeedsCount}
                    onChange={(e) => setMedicalNeedsCount(parseInt(e.target.value) || 0)}
                    className="w-10 text-center font-black text-sm bg-transparent text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMedicalNeedsCount(prev => (prev || 0) + 1)}
                    className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm select-none cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description and Real File Attachment */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-white">
              3. Emergency Description & Location Details *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your current situation (e.g. Water level rising to 1st floor, 4 family members on terrace, urgent rescue boat needed)..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            {/* Hidden Real File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            {/* Media Upload Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  photoPreview
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Camera className="w-4 h-4 text-rose-500" />
                <span>{photoPreview ? 'Change Photo' : 'Upload Scene Photo'}</span>
              </button>

              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-red-600 text-white animate-pulse font-bold'
                    : voiceDuration > 0
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Mic className="w-4 h-4 text-blue-500" />
                <span>
                  {isRecordingVoice
                    ? `Recording (${voiceDuration}s)...`
                    : voiceDuration > 0
                    ? `🎙️ Voice Note (${voiceDuration}s)`
                    : 'Record Voice Note'}
                </span>
              </button>
            </div>

            {/* Photo Preview Thumbnail if attached */}
            {photoPreview && (
              <div className="relative inline-block mt-2 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                <img
                  src={photoPreview}
                  alt="Incident Scene"
                  className="w-28 h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-red-600 text-white rounded-full transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] text-center font-bold py-0.5">
                  Photo Attached
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-5 h-5" />}
              className="w-full py-4 text-sm font-black uppercase tracking-wider shadow-xl shadow-red-600/30"
            >
              [ SEND HELP REQUEST ]
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
