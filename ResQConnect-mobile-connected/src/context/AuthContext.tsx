import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole, EmergencyContact } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  switchRole: (newRole: UserRole) => void;
  login: (identifier: string, password?: string, preferredRole?: UserRole) => Promise<UserProfile>;
  register: (data: Partial<UserProfile> & { password?: string }) => Promise<UserProfile>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const switchRole = (newRole: UserRole) => {
    const updated = authService.switchRole(newRole);
    setCurrentUser({ ...updated });
  };

  const login = async (identifier: string, password?: string, preferredRole?: UserRole) => {
    setIsLoading(true);
    try {
      const user = await authService.login(identifier, password, preferredRole);
      setCurrentUser({ ...user });
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<UserProfile> & { password?: string }) => {
    setIsLoading(true);
    try {
      const user = await authService.register(data);
      setCurrentUser({ ...user });
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const u = authService.updateProfile(updated);
    setCurrentUser({ ...u });
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const u = authService.addEmergencyContact(contact);
    setCurrentUser({ ...u });
  };

  const removeEmergencyContact = (id: string) => {
    const u = authService.removeEmergencyContact(id);
    setCurrentUser({ ...u });
  };

  const role: UserRole = currentUser?.role || 'citizen';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isLoading,
        switchRole,
        login,
        register,
        logout,
        updateProfile,
        addEmergencyContact,
        removeEmergencyContact
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
