export type UserRole = 'citizen' | 'government' | 'helper';

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state: string;
  district: string;
  city: string;
  area?: string;
  avatar?: string;
  isVerified: boolean;
  verificationBadge?: string;
  emergencyContacts: EmergencyContact[];
  skills?: string[]; // for helpers
  designation?: string; // for government officials
  department?: string; // for government officials
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
}
