import { LocationCoordinates } from './emergency';

export type HelperAvailability = 'AVAILABLE' | 'OFFLINE' | 'BUSY';

export interface HelperProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  skills: string[];
  isVerified: boolean;
  verificationBadge: string;
  availability: HelperAvailability;
  rating: number;
  reviewCount: number;
  completedMissions: number;
  avgResponseTimeMin: number;
  location: LocationCoordinates;
  distanceKm: number;
  activeMissionId?: string;
  badges: string[];
}
