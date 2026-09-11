import { AlarmAcknowledgement, EmergencyAlert } from '../types/emergency';
import { MOCK_ACKNOWLEDGEMENTS } from './mockData';
import { alarmAudioService } from './alarmAudioService';
import { emergencyService } from './emergencyService';

const STORAGE_KEY_ACKS = 'resq_alarm_acknowledgements';

class AlarmService {
  private acknowledgements: AlarmAcknowledgement[] = [];
  private activeAlarmAlert: EmergencyAlert | null = null;
  private alarmListeners: Array<(alert: EmergencyAlert | null) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    const stored = localStorage.getItem(STORAGE_KEY_ACKS);
    if (stored) {
      try {
        this.acknowledgements = JSON.parse(stored);
      } catch {
        this.acknowledgements = [...MOCK_ACKNOWLEDGEMENTS];
      }
    } else {
      this.acknowledgements = [...MOCK_ACKNOWLEDGEMENTS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_ACKS, JSON.stringify(this.acknowledgements));
  }

  public subscribeToAlarm(listener: (alert: EmergencyAlert | null) => void) {
    this.alarmListeners.push(listener);
    // Notify current state
    listener(this.activeAlarmAlert);
    return () => {
      this.alarmListeners = this.alarmListeners.filter(l => l !== listener);
    };
  }

  private notifyAlarmChange() {
    this.alarmListeners.forEach(listener => listener(this.activeAlarmAlert));
  }

  public triggerAlarm(alert: EmergencyAlert, playSound: boolean = true) {
    this.activeAlarmAlert = alert;
    this.notifyAlarmChange();

    if (playSound) {
      alarmAudioService.startSiren(alert.severity === 'CRITICAL' ? 'wail' : 'yelp');
    }

    // Vibrate device if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([500, 250, 500, 250, 500, 250, 1000]);
      } catch {
        // Ignore vibration failure
      }
    }
  }

  public acknowledgeAndStopAlarm(userId: string, userName: string, role: string): AlarmAcknowledgement | null {
    if (!this.activeAlarmAlert) return null;

    const alert = this.activeAlarmAlert;
    alarmAudioService.stopSiren();

    const ack: AlarmAcknowledgement = {
      id: `ack-${Date.now()}`,
      alertId: alert.id,
      alertTitle: alert.title,
      userId,
      userName,
      role,
      receivedTime: alert.broadcastTime,
      acknowledgedTime: new Date().toISOString(),
      isAcknowledged: true
    };

    this.acknowledgements.unshift(ack);
    this.save();
    emergencyService.incrementAcknowledgement(alert.id);

    this.activeAlarmAlert = null;
    this.notifyAlarmChange();

    return ack;
  }

  public getActiveAlarmAlert(): EmergencyAlert | null {
    return this.activeAlarmAlert;
  }

  public getAcknowledgements(): AlarmAcknowledgement[] {
    return [...this.acknowledgements];
  }

  public getAcknowledgementsByAlert(alertId: string): AlarmAcknowledgement[] {
    return this.acknowledgements.filter(a => a.alertId === alertId);
  }

  public getStats() {
    const totalAcks = this.acknowledgements.length;
    const avgResponseTimeSec = 14.2; // mock average
    return {
      totalAcks,
      acknowledgedRate: 87.2, // percentage
      avgResponseTimeSec
    };
  }
}

export const alarmService = new AlarmService();
