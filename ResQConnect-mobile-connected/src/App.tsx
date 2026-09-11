import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { EmergencyProvider, useEmergency } from './context/EmergencyContext';
import { NetworkProvider, useNetwork } from './context/NetworkContext';

// Common components
import { TopHeader } from './components/common/TopHeader';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { QuickRoleSwitcher } from './components/common/QuickRoleSwitcher';
import { OfflineBanner } from './components/common/OfflineBanner';

// Emergency modals
import { FullScreenAlarmModal } from './components/emergency/FullScreenAlarmModal';
import { SOSModal } from './components/emergency/SOSModal';
import { EmergencyBroadcastModal } from './components/emergency/EmergencyBroadcastModal';

// Auth screens
import { SplashScreen } from './screens/auth/SplashScreen';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { RoleSelectScreen } from './screens/auth/RoleSelectScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';

// Citizen screens
import { CitizenHomeScreen } from './screens/citizen/CitizenHomeScreen';
import { AlertsScreen } from './screens/citizen/AlertsScreen';
import { HelpRequestFormScreen } from './screens/citizen/HelpRequestFormScreen';
import { RequestTrackingScreen } from './screens/citizen/RequestTrackingScreen';
import { ResourcesScreen } from './screens/citizen/ResourcesScreen';
import { DonationScreen } from './screens/citizen/DonationScreen';
import { DonationReceiptScreen } from './screens/citizen/DonationReceiptScreen';
import { EmergencyContactsScreen } from './screens/citizen/EmergencyContactsScreen';
import { CitizenProfileScreen } from './screens/citizen/CitizenProfileScreen';

// Official screens
import { OfficialDashboardScreen } from './screens/official/OfficialDashboardScreen';
import { ManageEmergenciesScreen } from './screens/official/ManageEmergenciesScreen';
import { ManageResourcesScreen } from './screens/official/ManageResourcesScreen';
import { OfficialDonationsScreen } from './screens/official/OfficialDonationsScreen';
import { AssignResourceModal } from './screens/official/AssignResourceModal';

// Helper screens
import { HelperDashboardScreen } from './screens/helper/HelperDashboardScreen';
import { HelperRequestsScreen } from './screens/helper/HelperRequestsScreen';
import { HelperMissionScreen } from './screens/helper/HelperMissionScreen';
import { HelperHistoryScreen } from './screens/helper/HelperHistoryScreen';

// Shared screens
import { NotificationsScreen } from './screens/shared/NotificationsScreen';
import { SettingsScreen } from './screens/shared/SettingsScreen';
import { MapScreen } from './screens/shared/MapScreen';

// Types
import { UserRole } from './types/user';
import { HelpRequest } from './types/helpRequest';
import { EmergencyAlert } from './types/emergency';
import { DonationRecord } from './types/donation';
import { ResourceItem } from './types/resource';

type ActiveView =
  | 'tab'
  | 'helpRequestForm'
  | 'requestTracking'
  | 'donation'
  | 'donationReceipt'
  | 'emergencyContacts'
  | 'notifications'
  | 'settings'
  | 'helperMission';

type AuthView = 'splash' | 'welcome' | 'roleSelect' | 'login' | 'register';

const MainAppContent: React.FC = () => {
  const { currentUser, role, isAuthenticated, switchRole, logout, login } = useAuth();
  const { isDeviceFrame } = useTheme();

  // Navigation State
  const [authView, setAuthView] = useState<AuthView>('splash');
  const [registerRole, setRegisterRole] = useState<UserRole>('citizen');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [activeView, setActiveView] = useState<ActiveView>('tab');

  // Modal States
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [assignRequestModal, setAssignRequestModal] = useState<HelpRequest | null>(null);

  // Flow Payloads
  const [trackingRequest, setTrackingRequest] = useState<HelpRequest | null>(null);
  const [activeDonationReceipt, setActiveDonationReceipt] = useState<DonationRecord | null>(null);
  const [activeMissionRequest, setActiveMissionRequest] = useState<HelpRequest | null>(null);
  const [selectedDonationCampaignId, setSelectedDonationCampaignId] = useState<string | undefined>(undefined);

  // Synchronize tab based on role change
  useEffect(() => {
    if (role === 'government') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('home');
    }
    setActiveView('tab');
  }, [role]);

  // Auth flow transitions
  const handleSplashFinish = () => {
    setAuthView('welcome');
  };

  // Central Exit to Home Handler
  const handleExitToHome = () => {
    setActiveView('tab');
    if (role === 'government') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('home');
    }
  };

  // Navigations
  const handleOpenSOS = () => {
    setIsSOSModalOpen(true);
  };

  const handleViewTracking = (req: HelpRequest) => {
    setTrackingRequest(req);
    setActiveView('requestTracking');
  };

  const handleOpenHelpRequestForm = () => {
    setActiveView('helpRequestForm');
  };

  const handleOpenDonation = (campaignId?: string) => {
    setSelectedDonationCampaignId(campaignId);
    setActiveView('donation');
  };

  const handleDonationSuccess = (donation: DonationRecord) => {
    setActiveDonationReceipt(donation);
    setActiveView('donationReceipt');
  };

  const handleOpenMission = (req: HelpRequest) => {
    setActiveMissionRequest(req);
    setActiveView('helperMission');
  };

  // Render Sub-Views (Non-Tab Pages)
  const renderActiveView = () => {
    switch (activeView) {
      case 'helpRequestForm':
        return (
          <HelpRequestFormScreen
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
            onSuccessNavigateToTracking={(req) => handleViewTracking(req)}
          />
        );

      case 'requestTracking':
        if (!trackingRequest) {
          setActiveView('tab');
          return null;
        }
        return (
          <RequestTrackingScreen
            request={trackingRequest}
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
          />
        );

      case 'donation':
        return (
          <DonationScreen
            initialCampaignId={selectedDonationCampaignId}
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
            onDonationSuccess={handleDonationSuccess}
          />
        );

      case 'donationReceipt':
        if (!activeDonationReceipt) {
          setActiveView('tab');
          return null;
        }
        return (
          <DonationReceiptScreen
            donation={activeDonationReceipt}
            onBackToHome={handleExitToHome}
          />
        );

      case 'emergencyContacts':
        return (
          <EmergencyContactsScreen
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
            onNotificationClick={(notif) => {
              if (notif.category === 'HELP_REQUEST') {
                setActiveView('tab');
                setCurrentTab(role === 'helper' ? 'requests' : 'home');
              } else if (notif.category === 'EMERGENCY_ALERT') {
                setActiveView('tab');
                setCurrentTab(role === 'government' ? 'emergencies' : 'alerts');
              }
            }}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
          />
        );

      case 'helperMission':
        if (!activeMissionRequest) {
          setActiveView('tab');
          return null;
        }
        return (
          <HelperMissionScreen
            request={activeMissionRequest}
            onBack={() => setActiveView('tab')}
            onExitToHome={handleExitToHome}
            onMissionCompleted={() => {
              setActiveView('tab');
              setCurrentTab('history');
            }}
          />
        );

      case 'tab':
      default:
        return renderTabContent();
    }
  };

  // Render Tabs Content based on current User Role
  const renderTabContent = () => {
    // 👤 Citizen Role Tabs
    if (role === 'citizen') {
      switch (currentTab) {
        case 'home':
          return (
            <CitizenHomeScreen
              onOpenSOSModal={handleOpenSOS}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenHelpRequestForm={handleOpenHelpRequestForm}
              onOpenAlertDetails={() => setCurrentTab('alerts')}
              onOpenRequestTracking={handleViewTracking}
              onOpenDonationCampaign={handleOpenDonation}
              onOpenEmergencyContacts={() => setActiveView('emergencyContacts')}
            />
          );

        case 'alerts':
          return (
            <AlertsScreen
              onViewDetails={() => {}}
              onExitToHome={handleExitToHome}
            />
          );

        case 'resources':
          return (
            <ResourcesScreen
              onOpenMap={() => setCurrentTab('home')}
              onExitToHome={handleExitToHome}
            />
          );

        case 'profile':
          return (
            <CitizenProfileScreen
              onOpenSettings={() => setActiveView('settings')}
              onOpenEmergencyContacts={() => setActiveView('emergencyContacts')}
              onLogout={logout}
            />
          );

        default:
          return (
            <CitizenHomeScreen
              onOpenSOSModal={handleOpenSOS}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenHelpRequestForm={handleOpenHelpRequestForm}
              onOpenAlertDetails={() => setCurrentTab('alerts')}
              onOpenRequestTracking={handleViewTracking}
              onOpenDonationCampaign={handleOpenDonation}
              onOpenEmergencyContacts={() => setActiveView('emergencyContacts')}
            />
          );
      }
    }

    // 🏛️ Government Official Role Tabs
    if (role === 'government') {
      switch (currentTab) {
        case 'dashboard':
          return (
            <OfficialDashboardScreen
              onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenAssignModal={(req) => setAssignRequestModal(req)}
              onViewAlertDetails={() => setCurrentTab('emergencies')}
            />
          );

        case 'emergencies':
          return (
            <ManageEmergenciesScreen
              onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
              onViewAlertDetails={() => {}}
              onExitToHome={handleExitToHome}
            />
          );

        case 'resources':
          return <ManageResourcesScreen onExitToHome={handleExitToHome} />;

        case 'donations':
          return <OfficialDonationsScreen onExitToHome={handleExitToHome} />;

        case 'profile':
          return (
            <CitizenProfileScreen
              onOpenSettings={() => setActiveView('settings')}
              onOpenEmergencyContacts={() => setActiveView('emergencyContacts')}
              onLogout={logout}
            />
          );

        default:
          return (
            <OfficialDashboardScreen
              onOpenBroadcastModal={() => setIsBroadcastModalOpen(true)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenAssignModal={(req) => setAssignRequestModal(req)}
              onViewAlertDetails={() => setCurrentTab('emergencies')}
            />
          );
      }
    }

    // 🤝 Helper / Activist Role Tabs
    if (role === 'helper') {
      switch (currentTab) {
        case 'home':
          return (
            <HelperDashboardScreen
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenMission={handleOpenMission}
            />
          );

        case 'requests':
          return (
            <HelperRequestsScreen
              onOpenMission={handleOpenMission}
              onExitToHome={handleExitToHome}
            />
          );

        case 'map':
          return <MapScreen onExitToHome={handleExitToHome} />;

        case 'history':
          return <HelperHistoryScreen onExitToHome={handleExitToHome} />;

        case 'profile':
          return (
            <CitizenProfileScreen
              onOpenSettings={() => setActiveView('settings')}
              onOpenEmergencyContacts={() => setActiveView('emergencyContacts')}
              onLogout={logout}
            />
          );

        default:
          return (
            <HelperDashboardScreen
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenMission={handleOpenMission}
            />
          );
      }
    }

    return null;
  };

  // Auth Flow Screens if not logged in
  if (!currentUser) {
    if (authView === 'splash') {
      return <SplashScreen onFinish={handleSplashFinish} />;
    }
    if (authView === 'welcome') {
      return (
        <WelcomeScreen
          onLogin={() => setAuthView('login')}
          onRegister={() => setAuthView('roleSelect')}
          onQuickDemoLogin={(r) => {
            switchRole(r);
            setAuthView('welcome');
          }}
        />
      );
    }
    if (authView === 'roleSelect') {
      return (
        <RoleSelectScreen
          selectedRole={registerRole}
          onSelectRole={(r) => setRegisterRole(r)}
          onContinue={() => setAuthView('register')}
          onBack={() => setAuthView('welcome')}
        />
      );
    }
    if (authView === 'login') {
      return (
        <LoginScreen
          onBack={() => setAuthView('welcome')}
          onGoToRegister={() => setAuthView('roleSelect')}
          onLoginSuccess={() => setAuthView('welcome')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterScreen
          initialRole={registerRole}
          onBack={() => setAuthView('roleSelect')}
          onGoToLogin={() => setAuthView('login')}
          onRegisterSuccess={() => setAuthView('welcome')}
        />
      );
    }
  }

  return (
    <div className={`min-h-screen bg-slate-950 flex flex-col items-center justify-start ${isDeviceFrame ? 'py-4 sm:py-8' : ''}`}>
      {/* Container / Mobile Frame Showcase Wrapper */}
      <div
        className={`w-full max-w-md bg-slate-100 dark:bg-slate-950 flex flex-col min-h-screen relative overflow-x-hidden ${
          isDeviceFrame
            ? 'sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-white/10 sm:min-h-[844px] sm:max-h-[90vh]'
            : 'max-w-xl'
        }`}
      >
        {/* Dynamic Island / Bezel Mockup in Frame mode */}
        {isDeviceFrame && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3 pb-1 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 text-xs select-none">
            <span className="font-bold text-[11px] font-mono">09:41</span>
            <div className="w-24 h-4 bg-slate-950 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Demo Quick Role Switcher (Top Header Bar) */}
        <QuickRoleSwitcher
          onRoleChange={(newRole) => {
            setActiveView('tab');
            if (newRole === 'government') setCurrentTab('dashboard');
            else setCurrentTab('home');
          }}
        />

        {/* Top Header with Home Return */}
        <TopHeader
          onOpenNotifications={() => setActiveView('notifications')}
          onGoHome={handleExitToHome}
        />

        {/* Offline / Poor Connection Banner */}
        <OfflineBanner />

        {/* Main Scrollable Viewport */}
        <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
          {renderActiveView()}
        </main>

        {/* Bottom Role-Tailored Navigation (when in main tab view) */}
        {activeView === 'tab' && (
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              setActiveView('tab');
            }}
            onOpenSOSModal={handleOpenSOS}
          />
        )}

        {/* Global Mission-Critical Full Screen Siren Alarm Modal */}
        <FullScreenAlarmModal />

        {/* Global Instant SOS Dispatch Confirmation Modal */}
        <SOSModal
          isOpen={isSOSModalOpen}
          onClose={() => setIsSOSModalOpen(false)}
          onViewTracking={(req) => handleViewTracking(req)}
        />

        {/* Official Emergency Broadcast Modal */}
        <EmergencyBroadcastModal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
          onSuccess={() => {
            setCurrentTab('emergencies');
            setActiveView('tab');
          }}
        />

        {/* Official Resource Assignment Modal */}
        <AssignResourceModal
          isOpen={!!assignRequestModal}
          request={assignRequestModal}
          onClose={() => setAssignRequestModal(null)}
          onSuccess={() => {}}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmergencyProvider>
          <NetworkProvider>
            <MainAppContent />
          </NetworkProvider>
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
