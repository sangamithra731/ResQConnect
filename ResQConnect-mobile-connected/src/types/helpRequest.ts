import { EmergencySeverity, LocationCoordinates } from './emergency';

export type HelpRequestStatus =
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'RESPONDING'
  | 'ASSISTANCE_PROVIDED'
  | 'RESOLVED'
  | 'CANCELLED';

export type EmergencyRequestType =
  | 'Medical'
  | 'Fire'
  | 'Flood'
  | 'Earthquake'
  | 'Cyclone'
  | 'Accident'
  | 'Rescue'
  | 'Food'
  | 'Water'
  | 'Shelter'
  | 'Missing Person'
  | 'Other';

export interface TimelineEvent {
  status: HelpRequestStatus;
  timestamp: string;
  actor: string;
  note: string;
}

export interface HelpRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  emergencyType: EmergencyRequestType;
  priority: EmergencySeverity;
  peopleAffected: number;
  childrenCount: number;
  elderlyCount: number;
  medicalNeedsCount: number;
  description: string;
  location: LocationCoordinates;
  photoUrl?: string;
  voiceNoteDurationSec?: number;
  status: HelpRequestStatus;
  assignedHelperId?: string;
  assignedHelperName?: string;
  assignedHelperPhone?: string;
  assignedResourceId?: string;
  assignedResourceName?: string;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
  isSOS: boolean;
  backendSosId?: number; // set once synced to the RiskIntel command-center backend
}
