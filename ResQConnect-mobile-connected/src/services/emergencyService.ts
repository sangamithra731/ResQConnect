import { EmergencyAlert, DisasterCategory, EmergencySeverity } from '../types/emergency';
import { MOCK_EMERGENCY_ALERTS } from './mockData';
import { apiClient } from './apiClient';

const STORAGE_KEY_ALERTS = 'resq_emergency_alerts';

// Shape returned by RiskIntel's Alert.to_dict() (GET /api/public/alerts)
interface BackendAlert {
  id: number;
  alert_id: string;
  hazard: string;
  location: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  message: string;
  status: string;
  created_at: string;
  approved_by: string;
}

const HAZARD_TYPE_MAP: [RegExp, DisasterCategory][] = [
  [/flood|glof|lake|water level/i, 'Flood'],
  [/earthquake|seismic|tremor/i, 'Earthquake'],
  [/fire/i, 'Fire'],
  [/landslide|terrain|moraine|slope/i, 'Landslide'],
  [/cyclone|storm/i, 'Cyclone'],
  [/tsunami/i, 'Tsunami'],
  [/heat/i, 'Heatwave']
];

function mapHazardToType(hazard: string): DisasterCategory {
  const match = HAZARD_TYPE_MAP.find(([re]) => re.test(hazard));
  return match ? match[1] : 'Other';
}

function mapSeverity(severity: BackendAlert['severity']): EmergencySeverity {
  return severity === 'MODERATE' ? 'MEDIUM' : severity;
}

function backendAlertToEmergencyAlert(a: BackendAlert): EmergencyAlert {
  const [district, ...rest] = a.location.split(',').map(s => s.trim());
  return {
    id: `riskintel-${a.id}`,
    title: a.hazard,
    type: mapHazardToType(a.hazard),
    severity: mapSeverity(a.severity),
    headline: `${a.hazard} — ${a.location}`,
    description: a.message,
    recommendedAction: 'Follow instructions from local authorities, avoid low-lying and unstable areas, and monitor official channels for updates.',
    targetState: rest[rest.length - 1] || 'India',
    targetDistrict: district || a.location,
    coordinates: { lat: 20.5937, lng: 78.9629, address: a.location },
    broadcastTime: a.created_at.replace(' ', 'T') + 'Z',
    issuerName: a.approved_by && a.approved_by !== 'Pending' ? a.approved_by : 'RiskIntel Command Center',
    issuerDepartment: 'RiskIntel Disaster Command Center',
    isActive: a.status === 'ACTIVE',
    requiresAlarm: a.severity === 'CRITICAL' || a.severity === 'HIGH',
    acknowledgedCount: 0,
    totalTargetedUsers: 25000
  };
}

class EmergencyService {
  private alerts: EmergencyAlert[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const stored = localStorage.getItem(STORAGE_KEY_ALERTS);
    if (stored) {
      try {
        this.alerts = JSON.parse(stored);
      } catch {
        this.alerts = [...MOCK_EMERGENCY_ALERTS];
      }
    } else {
      this.alerts = [...MOCK_EMERGENCY_ALERTS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(this.alerts));
  }

  // Pulls live ACTIVE alerts from the RiskIntel backend and merges them
  // into the local alert list (replacing any previously-synced RiskIntel
  // alerts, keeping the app's own mock/local alerts untouched). Safe to
  // call anytime — silently no-ops if the backend isn't configured/reachable.
  public async syncFromBackend(): Promise<void> {
    if (!apiClient.isConfigured()) return;
    try {
      const backendAlerts = await apiClient.get<BackendAlert[]>('/api/public/alerts');
      const mapped = backendAlerts.map(backendAlertToEmergencyAlert);
      const localOnly = this.alerts.filter(a => !a.id.startsWith('riskintel-'));
      this.alerts = [...mapped, ...localOnly];
      this.save();
    } catch {
      // Backend unreachable/not deployed yet — keep existing local alerts.
    }
  }

  public getAlerts(): EmergencyAlert[] {
    return [...this.alerts];
  }

  public getActiveAlerts(): EmergencyAlert[] {
    return this.alerts.filter(a => a.isActive);
  }

  public getAlertById(id: string): EmergencyAlert | undefined {
    return this.alerts.find(a => a.id === id);
  }

  public getTargetedAlerts(state?: string, district?: string): EmergencyAlert[] {
    return this.alerts.filter(a => {
      if (!a.isActive) return false;
      if (!state && !district) return true;
      const matchState = !state || a.targetState.toLowerCase() === state.toLowerCase();
      const matchDistrict = !district || a.targetDistrict.toLowerCase() === district.toLowerCase();
      return matchState && matchDistrict;
    });
  }

  public createAlert(alertData: Omit<EmergencyAlert, 'id' | 'broadcastTime' | 'acknowledgedCount' | 'totalTargetedUsers'>): EmergencyAlert {
    const newAlert: EmergencyAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      broadcastTime: new Date().toISOString(),
      acknowledgedCount: 0,
      totalTargetedUsers: Math.floor(Math.random() * 40000) + 15000
    };
    this.alerts.unshift(newAlert);
    this.save();
    return newAlert;
  }

  public updateAlertStatus(id: string, isActive: boolean): EmergencyAlert | null {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.isActive = isActive;
      this.save();
      return alert;
    }
    return null;
  }

  public incrementAcknowledgement(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledgedCount += 1;
      this.save();
    }
  }

  public deleteAlert(id: string): boolean {
    const initialLen = this.alerts.length;
    this.alerts = this.alerts.filter(a => a.id !== id);
    if (this.alerts.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const emergencyService = new EmergencyService();
