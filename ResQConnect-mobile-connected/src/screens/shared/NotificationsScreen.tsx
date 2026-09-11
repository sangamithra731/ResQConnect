import React, { useState } from 'react';
import { notificationService } from '../../services/notificationService';
import { AppNotification, NotificationCategory } from '../../types/notification';
import { Button } from '../../components/common/Button';
import { formatRelativeTime } from '../../utils/formatters';
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Radio,
  HeartHandshake,
  Building,
  Heart,
  CheckCheck,
  Home as HomeIcon
} from 'lucide-react';

interface NotificationsScreenProps {
  onBack: () => void;
  onExitToHome?: () => void;
  onNotificationClick?: (notif: AppNotification) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  onBack,
  onExitToHome,
  onNotificationClick
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationService.getNotifications()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const refreshList = () => {
    setNotifications(notificationService.getNotifications());
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    refreshList();
  };

  const handleItemClick = (notif: AppNotification) => {
    notificationService.markAsRead(notif.id);
    refreshList();
    if (onNotificationClick) onNotificationClick(notif);
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'EMERGENCY_ALERT':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'HELP_REQUEST':
        return <Radio className="w-5 h-5 text-rose-500" />;
      case 'HELPER_UPDATE':
        return <HeartHandshake className="w-5 h-5 text-emerald-500" />;
      case 'GOV_UPDATE':
        return <Building className="w-5 h-5 text-blue-500" />;
      case 'DONATION':
        return <Heart className="w-5 h-5 text-amber-500 fill-current" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleExit = () => {
    if (onExitToHome) onExitToHome();
    else onBack();
  };

  let filtered = notifications;
  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter(n => n.category === selectedCategory);
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Top Header with Exit to Home */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                Dispatch Alerts Feed
              </span>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Notifications ({unreadCount} unread)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              onClick={handleExit}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-200 dark:border-slate-700"
              title="Exit to Home"
            >
              <HomeIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { key: 'ALL', label: 'All' },
            { key: 'EMERGENCY_ALERT', label: '🚨 Emergency Alert' },
            { key: 'HELP_REQUEST', label: '🆘 Help Request' },
            { key: 'HELPER_UPDATE', label: '🤝 Helper Update' },
            { key: 'GOV_UPDATE', label: '🏛️ Gov Update' },
            { key: 'DONATION', label: '💰 Donation' }
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-2.5">
        {filtered.length > 0 ? (
          filtered.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-rose-50/50 dark:bg-slate-800/90 border-rose-300 dark:border-rose-900/60 shadow-md shadow-red-500/5'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">No notifications</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              You are all caught up with emergency alerts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
