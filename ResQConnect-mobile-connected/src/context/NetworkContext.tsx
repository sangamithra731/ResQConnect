import React, { createContext, useContext, useState, useEffect } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  isReconnecting: boolean;
  lastSyncTime: string;
  toggleNetworkSimulation: () => void;
  triggerManualSync: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  useEffect(() => {
    const handleOnline = () => {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsOnline(true);
        setIsReconnecting(false);
        setLastSyncTime('Just now');
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleNetworkSimulation = () => {
    if (isOnline) {
      setIsOnline(false);
    } else {
      setIsReconnecting(true);
      setTimeout(() => {
        setIsOnline(true);
        setIsReconnecting(false);
        setLastSyncTime('Just now');
      }, 1200);
    }
  };

  const triggerManualSync = () => {
    if (!isOnline) return;
    setIsReconnecting(true);
    setTimeout(() => {
      setIsReconnecting(false);
      setLastSyncTime('Just now');
    }, 800);
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isReconnecting,
        lastSyncTime,
        toggleNetworkSimulation,
        triggerManualSync
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
};
