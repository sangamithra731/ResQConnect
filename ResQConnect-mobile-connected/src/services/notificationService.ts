import { AppNotification, NotificationCategory } from '../types/notification';
import { MOCK_NOTIFICATIONS } from './mockData';

const STORAGE_KEY_NOTIFS = 'resq_notifications';

class NotificationService {
  private notifications: AppNotification[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const stored = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (stored) {
      try {
        this.notifications = JSON.parse(stored);
      } catch {
        this.notifications = [...MOCK_NOTIFICATIONS];
      }
    } else {
      this.notifications = [...MOCK_NOTIFICATIONS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(this.notifications));
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  public markAsRead(id: string): void {
    const notif = this.notifications.find(n => n.id === id);
    if (notif && !notif.isRead) {
      notif.isRead = true;
      this.save();
    }
  }

  public markAllAsRead(): void {
    this.notifications.forEach(n => (n.isRead = true));
    this.save();
  }

  public addNotification(category: NotificationCategory, title: string, message: string, relatedId?: string): AppNotification {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      category,
      title,
      message,
      timestamp: 'Just now',
      isRead: false,
      relatedId
    };
    this.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }
}

export const notificationService = new NotificationService();
