import { HelperProfile, HelperAvailability } from '../types/helper';
import { MOCK_HELPERS } from './mockData';

const STORAGE_KEY_HELPERS = 'resq_helpers';

class HelperService {
  private helpers: HelperProfile[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const stored = localStorage.getItem(STORAGE_KEY_HELPERS);
    if (stored) {
      try {
        this.helpers = JSON.parse(stored);
      } catch {
        this.helpers = [...MOCK_HELPERS];
      }
    } else {
      this.helpers = [...MOCK_HELPERS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_HELPERS, JSON.stringify(this.helpers));
  }

  public getHelpers(): HelperProfile[] {
    return [...this.helpers];
  }

  public getVerifiedHelpers(): HelperProfile[] {
    return this.helpers.filter(h => h.isVerified);
  }

  public getAvailableHelpers(): HelperProfile[] {
    return this.helpers.filter(h => h.isVerified && h.availability === 'AVAILABLE');
  }

  public getHelperById(id: string): HelperProfile | undefined {
    return this.helpers.find(h => h.id === id);
  }

  public toggleAvailability(id: string, availability: HelperAvailability): HelperProfile | null {
    const helper = this.helpers.find(h => h.id === id);
    if (!helper) return null;

    helper.availability = availability;
    this.save();
    return helper;
  }

  public updateMissionStatus(id: string, activeMissionId?: string, isCompleted: boolean = false): HelperProfile | null {
    const helper = this.helpers.find(h => h.id === id);
    if (!helper) return null;

    helper.activeMissionId = activeMissionId;
    if (isCompleted) {
      helper.completedMissions += 1;
      helper.availability = 'AVAILABLE';
    } else if (activeMissionId) {
      helper.availability = 'BUSY';
    }
    this.save();
    return helper;
  }

  public getStats() {
    const total = this.helpers.length;
    const verified = this.helpers.filter(h => h.isVerified).length;
    const available = this.helpers.filter(h => h.availability === 'AVAILABLE').length;
    const busy = this.helpers.filter(h => h.availability === 'BUSY').length;
    const totalCompleted = this.helpers.reduce((sum, h) => sum + h.completedMissions, 0);

    return {
      total,
      verified,
      available,
      busy,
      totalCompleted
    };
  }
}

export const helperService = new HelperService();
