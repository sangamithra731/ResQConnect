export type EmergencySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DisasterCategory =
  | 'Flood'
  | 'Cyclone'
  | 'Earthquake'
  | 'Fire'
  | 'Landslide'
  | 'Medical Emergency'
  | 'Heatwave'
  | 'Tsunami'
  | 'Industrial Disaster'
  | 'Other';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  type: DisasterCategory;
  severity: EmergencySeverity;
  headline: string;
  description: string;
  recommendedAction: string;
  targetState: string;
  targetDistrict: string;
  targetCity?: string;
  targetArea?: string;
  coordinates: LocationCoordinates;
  broadcastTime: string;
  issuerName: string;
  issuerDepartment: string;
  isActive: boolean;
  requiresAlarm: boolean;
  affectedPopulationEstimate?: number;
  acknowledgedCount: number;
  totalTargetedUsers: number;
}

export interface AlarmAcknowledgement {
  id: string;
  alertId: string;
  alertTitle: string;
  userId: string;
  userName: string;
  role: string;
  receivedTime: string;
  acknowledgedTime: string;
  isAcknowledged: boolean;
}
