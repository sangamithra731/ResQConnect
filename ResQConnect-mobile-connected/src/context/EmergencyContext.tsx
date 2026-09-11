import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmergencyAlert } from '../types/emergency';
import { HelpRequest, HelpRequestStatus, EmergencyRequestType } from '../types/helpRequest';
import { alarmService } from '../services/alarmService';
import { emergencyService } from '../services/emergencyService';
import { helpRequestService } from '../services/helpRequestService';
import { notificationService } from '../services/notificationService';
import { locationService } from '../services/locationService';
import { useAuth } from './AuthContext';

interface EmergencyContextType {
  activeAlarmAlert: EmergencyAlert | null;
  triggerAlarm: (alert: EmergencyAlert) => void;
  acknowledgeAlarm: () => void;
  activeAlerts: EmergencyAlert[];
  allAlerts: EmergencyAlert[];
  broadcastEmergency: (alertData: Omit<EmergencyAlert, 'id' | 'broadcastTime' | 'acknowledgedCount' | 'totalTargetedUsers'>) => EmergencyAlert;
  activeSOSRequest: HelpRequest | undefined;
  triggerSOS: () => Promise<HelpRequest>;
  createHelpRequest: (data: {
    emergencyType: EmergencyRequestType;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    peopleAffected: number;
    childrenCount: number;
    elderlyCount: number;
    medicalNeedsCount: number;
    description: string;
    photoUrl?: string;
    voiceNoteDurationSec?: number;
  }) => Promise<HelpRequest>;
  updateRequestStatus: (requestId: string, status: HelpRequestStatus, note?: string) => void;
  assignToRequest: (requestId: string, helperId?: string, helperName?: string, helperPhone?: string, resourceId?: string, resourceName?: string) => void;
  refreshData: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeAlarmAlert, setActiveAlarmAlert] = useState<EmergencyAlert | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [allAlerts, setAllAlerts] = useState<EmergencyAlert[]>([]);
  const [activeSOSRequest, setActiveSOSRequest] = useState<HelpRequest | undefined>(undefined);

  const refreshData = () => {
    setActiveAlerts(emergencyService.getActiveAlerts());
    setAllAlerts(emergencyService.getAlerts());
    if (currentUser) {
      setActiveSOSRequest(helpRequestService.getActiveSOSRequest(currentUser.id));
    }
  };

  // Pulls live alerts from the RiskIntel backend (no-op if not configured
  // or unreachable), then refreshes local state once the merge is done.
  const syncAndRefresh = () => {
    refreshData();
    emergencyService.syncFromBackend().then(refreshData);
  };

  useEffect(() => {
    syncAndRefresh();
    const unsubscribeAlarm = alarmService.subscribeToAlarm((alert) => {
      setActiveAlarmAlert(alert);
    });
    return () => {
      unsubscribeAlarm();
    };
  }, [currentUser]);

  const triggerAlarm = (alert: EmergencyAlert) => {
    alarmService.triggerAlarm(alert, true);
  };

  const acknowledgeAlarm = () => {
    if (currentUser) {
      alarmService.acknowledgeAndStopAlarm(currentUser.id, currentUser.name, currentUser.role);
    }
  };

  const broadcastEmergency = (alertData: Omit<EmergencyAlert, 'id' | 'broadcastTime' | 'acknowledgedCount' | 'totalTargetedUsers'>) => {
    const alert = emergencyService.createAlert(alertData);
    notificationService.addNotification(
      'EMERGENCY_ALERT',
      `🚨 ${alert.title}`,
      alert.headline,
      alert.id
    );
    refreshData();

    if (alert.requiresAlarm) {
      // Trigger simulation for active citizen
      alarmService.triggerAlarm(alert, true);
    }
    return alert;
  };

  const triggerSOS = async () => {
    if (!currentUser) throw new Error('Must be logged in');
    const coords = await locationService.getCurrentLocation();
    const req = helpRequestService.createSOS(currentUser.id, currentUser.name, currentUser.phone, coords);
    notificationService.addNotification(
      'HELP_REQUEST',
      '🆘 SOS Beacon Activated',
      'Your emergency distress beacon has been broadcasted to state command center and nearby first responders.',
      req.id
    );
    refreshData();
    return req;
  };

  const createHelpRequest = async (data: {
    emergencyType: EmergencyRequestType;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    peopleAffected: number;
    childrenCount: number;
    elderlyCount: number;
    medicalNeedsCount: number;
    description: string;
    photoUrl?: string;
    voiceNoteDurationSec?: number;
  }) => {
    if (!currentUser) throw new Error('Must be logged in');
    const coords = await locationService.getCurrentLocation();
    const req = helpRequestService.createHelpRequest({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterPhone: currentUser.phone,
      location: coords,
      ...data
    });
    notificationService.addNotification(
      'HELP_REQUEST',
      `Help Request Logged: ${data.emergencyType}`,
      `Priority: ${data.priority}. Request #${req.id} sent for rapid triage.`,
      req.id
    );
    refreshData();
    return req;
  };

  const updateRequestStatus = (requestId: string, status: HelpRequestStatus, note?: string) => {
    const actor = currentUser?.name || 'Authorized Operator';
    helpRequestService.updateStatus(requestId, status, actor, note);
    refreshData();
  };

  const assignToRequest = (
    requestId: string,
    helperId?: string,
    helperName?: string,
    helperPhone?: string,
    resourceId?: string,
    resourceName?: string
  ) => {
    const actor = currentUser?.name || 'State Disaster Management Control';
    helpRequestService.assignHelperAndResource(requestId, actor, helperId, helperName, helperPhone, resourceId, resourceName);
    notificationService.addNotification(
      'HELPER_UPDATE',
      'Resource / Helper Dispatched',
      `Assigned to request #${requestId}`,
      requestId
    );
    refreshData();
  };

  return (
    <EmergencyContext.Provider
      value={{
        activeAlarmAlert,
        triggerAlarm,
        acknowledgeAlarm,
        activeAlerts,
        allAlerts,
        broadcastEmergency,
        activeSOSRequest,
        triggerSOS,
        createHelpRequest,
        updateRequestStatus,
        assignToRequest,
        refreshData
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) throw new Error('useEmergency must be used within EmergencyProvider');
  return context;
};
