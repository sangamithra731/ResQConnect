import React, { useState } from 'react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { HelpRequest } from '../../types/helpRequest';
import { formatDateTime } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { AlertOctagon, MapPin, CheckCircle, ShieldAlert, PhoneCall, Radio, X } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewTracking?: (request: HelpRequest) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, onClose, onViewTracking }) => {
  const { triggerSOS, activeSOSRequest } = useEmergency();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdRequest, setCreatedRequest] = useState<HelpRequest | null>(null);

  const handleConfirmSOS = async () => {
    setIsSubmitting(true);
    try {
      const req = await triggerSOS();
      setCreatedRequest(req);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCreatedRequest(null);
    onClose();
  };

  const displayRequest = createdRequest || activeSOSRequest;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" showCloseButton={!displayRequest}>
      {displayRequest ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center border border-red-500/40 animate-pulse">
            <Radio className="w-9 h-9" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white uppercase tracking-wider inline-block mb-2 animate-bounce-subtle">
              🆘 HELP REQUEST ACTIVE
            </span>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Emergency Beacon Dispatched</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your location and emergency signal are live in the State Disaster Command Center and nearby verified first responder queue.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700/80 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Request ID:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">#{displayRequest.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Emergency Type:</span>
              <span className="font-bold text-red-600 dark:text-red-400">{displayRequest.emergencyType} (SOS Dispatch)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <StatusBadge status={displayRequest.status} variant="status" size="sm" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Time Dispatched:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{formatDateTime(displayRequest.createdAt)}</span>
            </div>

            <div className="flex items-start justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">Live Location:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px] flex items-center justify-end gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{displayRequest.location.address || `${displayRequest.location.city}, ${displayRequest.location.state}`}</span>
              </span>
            </div>

            {displayRequest.assignedHelperName && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 mt-2">
                <p className="font-bold">Assigned Helper:</p>
                <p>{displayRequest.assignedHelperName}</p>
                {displayRequest.assignedHelperPhone && (
                  <p className="font-mono text-[11px] mt-0.5">📞 {displayRequest.assignedHelperPhone}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {onViewTracking && (
              <Button
                variant="primary"
                onClick={() => {
                  handleClose();
                  onViewTracking(displayRequest);
                }}
                className="w-full"
              >
                Track Live Rescue Status
              </Button>
            )}
            <Button variant="outline" onClick={handleClose} className="w-full">
              Close Window
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-600/15 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center border-2 border-red-500/30 animate-pulse-fast">
            <AlertOctagon className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Emergency SOS Confirmation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Are you sure you need emergency assistance?
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl p-3.5 text-left text-xs text-red-900 dark:text-red-200 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              What happens next:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
              <li>Your GPS coordinates will be locked immediately.</li>
              <li>State Disaster Response & nearby verified helpers are alerted.</li>
              <li>Your emergency contacts will receive an SMS alert.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              variant="sos"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleConfirmSOS}
              className="flex-1 uppercase font-black tracking-wider text-sm py-3.5"
            >
              [ YES, REQUEST HELP ]
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleClose}
              disabled={isSubmitting}
              className="sm:w-28 text-slate-600 dark:text-slate-400"
            >
              [ CANCEL ]
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
