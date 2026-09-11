import { LocationCoordinates } from './emergency';

export type ResourceCategory =
  | 'Ambulance'
  | 'Hospital'
  | 'Fire & Rescue'
  | 'Rescue Team'
  | 'Food Supplies'
  | 'Drinking Water'
  | 'Shelter'
  | 'Medical Supplies';

export type ResourceStatus = 'AVAILABLE' | 'DISPATCHED' | 'MAINTENANCE' | 'DEPLETED';

export interface ResourceItem {
  id: string;
  name: string;
  category: ResourceCategory;
  quantity: number;
  availableQuantity: number;
  unit: string;
  location: LocationCoordinates;
  distanceKm: number;
  contactPerson: string;
  contactPhone: string;
  status: ResourceStatus;
  district: string;
  state: string;
  lastUpdated: string;
  notes?: string;
}
