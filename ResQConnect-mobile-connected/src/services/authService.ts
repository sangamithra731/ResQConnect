import { UserProfile, UserRole, EmergencyContact } from '../types/user';
import { MOCK_USERS } from './mockData';
import { apiClient, ApiError } from './apiClient';

const STORAGE_KEY_USER = 'resq_current_user';
const STORAGE_KEY_ALL_USERS = 'resq_all_users';

// Shape returned by RiskIntel's User.to_dict() (backend command-center accounts)
interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'AUTHORITY' | 'ENVIRONMENTAL_MONITOR' | 'RESCUE_COORDINATOR' | 'VIEWER';
  active: boolean;
}

function mapBackendUser(backendUser: BackendUser, existing?: UserProfile | null): UserProfile {
  return {
    id: `riskintel-${backendUser.id}`,
    name: backendUser.name,
    email: backendUser.email,
    phone: existing?.phone || '+91 98765 43210',
    role: 'government',
    state: existing?.state || 'Tamil Nadu',
    district: existing?.district || 'Chennai',
    city: existing?.city || 'Chennai Central',
    area: existing?.area,
    avatar: existing?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${backendUser.name}`,
    isVerified: true,
    verificationBadge: `RiskIntel Command Center — ${backendUser.role.replace('_', ' ')}`,
    emergencyContacts: existing?.emergencyContacts || [
      { id: 'ec-def-1', name: 'Emergency Helpline 112', relationship: 'Official Emergency', phone: '112', isPrimary: true }
    ],
    designation: backendUser.role.replace('_', ' '),
    department: 'RiskIntel State Disaster Command Center',
    createdAt: existing?.createdAt || new Date().toISOString()
  };
}

class AuthService {
  private currentUser: UserProfile | null = null;
  private users: UserProfile[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const storedUsers = localStorage.getItem(STORAGE_KEY_ALL_USERS);
    if (storedUsers) {
      try {
        this.users = JSON.parse(storedUsers);
      } catch {
        this.users = [...MOCK_USERS];
      }
    } else {
      this.users = [...MOCK_USERS];
      this.saveUsers();
    }

    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch {
        this.currentUser = this.users[0];
      }
    } else {
      // Default to citizen
      this.currentUser = this.users[0];
      this.saveCurrentUser();
    }
  }

  private saveUsers() {
    localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(this.users));
  }

  private saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public switchRole(role: UserRole): UserProfile {
    const existing = this.users.find(u => u.role === role);
    if (existing) {
      this.currentUser = existing;
    } else {
      // Create template user for that role
      const newUser: UserProfile = {
        id: `user-${role}-${Date.now()}`,
        name: role === 'government' ? 'Officer Ramesh Varma' : role === 'helper' ? 'Ravi Volunteer' : 'Citizen Priya',
        email: `${role}@resqconnect.org`,
        phone: '+91 98765 43210',
        role: role,
        state: 'Tamil Nadu',
        district: 'Chennai',
        city: 'Chennai Central',
        isVerified: true,
        verificationBadge: role === 'government' ? 'Gov Official #GOV-TN-998' : role === 'helper' ? 'Verified First Responder' : 'Verified Citizen',
        emergencyContacts: [
          { id: 'ec-def-1', name: 'Emergency Helpline 112', relationship: 'Official Emergency', phone: '112', isPrimary: true }
        ],
        createdAt: new Date().toISOString()
      };
      this.users.push(newUser);
      this.saveUsers();
      this.currentUser = newUser;
    }
    this.saveCurrentUser();
    return this.currentUser;
  }

  public async login(identifier: string, password?: string, preferredRole?: UserRole): Promise<UserProfile> {
    // RiskIntel command-center accounts (ADMIN/AUTHORITY/etc.) are real
    // backend logins, seeded on the @riskintel.local domain. Route those
    // specifically to the real API; every other identifier (citizen/helper
    // mock accounts) keeps using the local flow below, since the backend
    // has no accounts for them.
    const isRiskIntelAccount = identifier.toLowerCase().endsWith('@riskintel.local');
    if (apiClient.isConfigured() && isRiskIntelAccount && password) {
      try {
        const result = await apiClient.post<{ success: boolean; user: BackendUser; error?: string }>('/api/login', {
          email: identifier,
          password
        });
        if (result.success) {
          const existingLocal = this.users.find(u => u.email.toLowerCase() === result.user.email.toLowerCase());
          const user = mapBackendUser(result.user, existingLocal);
          const index = this.users.findIndex(u => u.id === user.id);
          if (index >= 0) this.users[index] = user; else this.users.push(user);
          this.saveUsers();
          this.currentUser = user;
          this.saveCurrentUser();
          return user;
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          throw new Error('Invalid login credentials.');
        }
        // Network/config issue (backend not deployed/reachable yet) — fall
        // through to the local mock flow so the app keeps working offline.
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        // Find existing user matching identifier or role
        let user = this.users.find(
          u => (u.email.toLowerCase() === identifier.toLowerCase() || u.phone.includes(identifier)) &&
               (!preferredRole || u.role === preferredRole)
        );

        if (!user && preferredRole) {
          user = this.users.find(u => u.role === preferredRole);
        }

        if (!user) {
          user = this.users[0];
        }

        this.currentUser = user;
        this.saveCurrentUser();
        resolve(user);
      }, 300);
    });
  }

  public register(data: Partial<UserProfile> & { password?: string }): Promise<UserProfile> {
    // Note: the RiskIntel backend only has pre-seeded command-center staff
    // accounts (no public signup endpoint), so registration for all roles
    // stays local/mock. Government staff should log in with their real
    // @riskintel.local credentials instead of registering here.
    return new Promise((resolve) => {
      setTimeout(() => {
        const isOfficialOrHelper = data.role === 'government' || data.role === 'helper';
        const newUser: UserProfile = {
          id: `user-${data.role || 'citizen'}-${Date.now()}`,
          name: data.name || 'New ResQConnect User',
          email: data.email || 'user@example.com',
          phone: data.phone || '+91 90000 00000',
          role: data.role || 'citizen',
          state: data.state || 'Tamil Nadu',
          district: data.district || 'Chennai',
          city: data.city || 'Chennai',
          area: data.area || '',
          avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name || 'User'}`,
          isVerified: !isOfficialOrHelper, // Officials/helpers require verification badge
          verificationBadge: isOfficialOrHelper ? 'Verification in Progress (Mock Active)' : 'Aadhaar Verified',
          emergencyContacts: data.emergencyContacts && data.emergencyContacts.length > 0 ? data.emergencyContacts : [
            { id: `ec-${Date.now()}`, name: 'Primary Family Contact', relationship: 'Family', phone: '+91 98401 99999', isPrimary: true }
          ],
          skills: data.skills || (data.role === 'helper' ? ['First Aid', 'Emergency Transport'] : undefined),
          designation: data.designation || (data.role === 'government' ? 'Assistant Disaster Management Officer' : undefined),
          department: data.department || (data.role === 'government' ? 'State Disaster Management Authority' : undefined),
          createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        this.saveCurrentUser();
        resolve(newUser);
      }, 400);
    });
  }

  public updateProfile(updated: Partial<UserProfile>): UserProfile {
    if (!this.currentUser) throw new Error('No user logged in');
    this.currentUser = { ...this.currentUser, ...updated };
    const index = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (index >= 0) {
      this.users[index] = this.currentUser;
      this.saveUsers();
    }
    this.saveCurrentUser();
    return this.currentUser;
  }

  public addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): UserProfile {
    if (!this.currentUser) throw new Error('No user logged in');
    const newContact: EmergencyContact = {
      ...contact,
      id: `ec-${Date.now()}`
    };
    if (newContact.isPrimary) {
      this.currentUser.emergencyContacts.forEach(c => (c.isPrimary = false));
    }
    this.currentUser.emergencyContacts.push(newContact);
    this.updateProfile({ emergencyContacts: this.currentUser.emergencyContacts });
    return this.currentUser;
  }

  public removeEmergencyContact(contactId: string): UserProfile {
    if (!this.currentUser) throw new Error('No user logged in');
    this.currentUser.emergencyContacts = this.currentUser.emergencyContacts.filter(c => c.id !== contactId);
    if (this.currentUser.emergencyContacts.length > 0 && !this.currentUser.emergencyContacts.some(c => c.isPrimary)) {
      this.currentUser.emergencyContacts[0].isPrimary = true;
    }
    this.updateProfile({ emergencyContacts: this.currentUser.emergencyContacts });
    return this.currentUser;
  }

  public logout() {
    if (apiClient.isConfigured() && this.currentUser?.id.startsWith('riskintel-')) {
      // Fire-and-forget: clear the backend session cookie too.
      apiClient.post('/api/logout').catch(() => {});
    }
    this.currentUser = null;
    this.saveCurrentUser();
  }
}

export const authService = new AuthService();
