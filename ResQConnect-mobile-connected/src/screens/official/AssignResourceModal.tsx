import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { resourceService } from '../../services/resourceService';
import { helperService } from '../../services/helperService';
import { HelpRequest } from '../../types/helpRequest';
import { ResourceItem } from '../../types/resource';
import { HelperProfile } from '../../types/helper';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Boxes,
  HeartHandshake,
  LifeBuoy,
  CheckCircle2,
  Phone,
  ShieldCheck,
  MapPin,
  Send
} from 'lucide-react';

interface AssignResourceModalProps {
  isOpen: boolean;
  request: HelpRequest | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AssignResourceModal: React.FC<AssignResourceModalProps> = ({
  isOpen,
  request,
  onClose,
  onSuccess
}) => {
  const { assignToRequest } = useEmergency();
  const availableResources = resourceService.getAvailableResources();
  const availableHelpers = helperService.getAvailableHelpers();

  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    availableResources.length > 0 ? availableResources[0].id : ''
  );
  const [selectedHelperId, setSelectedHelperId] = useState<string>(
    availableHelpers.length > 0 ? availableHelpers[0].id : ''
  );

  const [isAssigning, setIsAssigning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!request) return null;

  const handleExecuteAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssigning(true);

    const chosenResource = availableResources.find(r => r.id === selectedResourceId);
    const chosenHelper = availableHelpers.find(h => h.id === selectedHelperId);

    try {
      assignToRequest(
        request.id,
        chosenHelper?.id,
        chosenHelper?.name,
        chosenHelper?.phone,
        chosenResource?.id,
        chosenResource?.name
      );

      // Decrement resource availability
      if (chosenResource) {
        resourceService.dispatchResource(chosenResource.id, 1);
      }
      // Set helper to busy
      if (chosenHelper) {
        helperService.updateMissionStatus(chosenHelper.id, request.id, false);
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1800);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispatch & Assign Units — #${request.id}`}
      size="lg"
    >
      {isSuccess ? (
        <div className="text-center py-6 space-y-3 animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Units Dispatched & Request Status = ASSIGNED
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned units alerted with requester live GPS coordinates and medical details.
          </p>
        </div>
      ) : (
        <form onSubmit={handleExecuteAssignment} className="space-y-4 text-xs">
          {/* Summary of Incident */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {request.emergencyType} Emergency
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Requester: {request.requesterName} ({request.requesterPhone})
                </p>
              </div>
              <StatusBadge status={request.priority} variant="severity" size="sm" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              {request.description}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-1">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <span>{request.location.address || `${request.location.city}, ${request.location.state}`}</span>
            </p>
          </div>

          {/* Select Hardware Resource */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 dark:text-white">
              1. Select Dispatch Resource / Vehicle *
            </label>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {availableResources.map(res => (
                <div
                  key={res.id}
                  onClick={() => setSelectedResourceId(res.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedResourceId === res.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">
                      {res.category === 'Ambulance'
                        ? '🚑'
                        : res.category === 'Hospital'
                        ? '🏥'
                        : res.category === 'Rescue Team'
                        ? '🛟'
                        : res.category === 'Fire & Rescue'
                        ? '🚒'
                        : res.category === 'Shelter'
                        ? '🏠'
                        : '🍱'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-xs">{res.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {res.distanceKm} km away • {res.availableQuantity} available
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="resourceGroup"
                    checked={selectedResourceId === res.id}
                    onChange={() => setSelectedResourceId(res.id)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Select Verified Helper */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-900 dark:text-white">
              2. Select Verified First Responder / Helper *
            </label>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {availableHelpers.map(h => (
                <div
                  key={h.id}
                  onClick={() => setSelectedHelperId(h.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedHelperId === h.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={h.avatar}
                      alt={h.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate text-xs">{h.name}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">
                        {h.verificationBadge} • {h.distanceKm} km away
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="helperGroup"
                    checked={selectedHelperId === h.id}
                    onChange={() => setSelectedHelperId(h.id)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isAssigning}
              leftIcon={<Send className="w-4 h-4" />}
              className="w-full text-xs font-black uppercase py-3 shadow-md"
            >
              [ CONFIRM ASSIGNMENT & DISPATCH ]
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
