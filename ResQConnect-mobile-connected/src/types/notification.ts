export type NotificationCategory =
  | 'EMERGENCY_ALERT'
  | 'HELP_REQUEST'
  | 'HELPER_UPDATE'
  | 'GOV_UPDATE'
  | 'DONATION'
  | 'GENERAL';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
  priority?: 'HIGH' | 'NORMAL' | 'URGENT';
}
