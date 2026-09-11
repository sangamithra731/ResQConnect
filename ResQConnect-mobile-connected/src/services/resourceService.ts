import { ResourceItem, ResourceCategory, ResourceStatus } from '../types/resource';
import { MOCK_RESOURCES } from './mockData';

const STORAGE_KEY_RESOURCES = 'resq_resources';

class ResourceService {
  private resources: ResourceItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const stored = localStorage.getItem(STORAGE_KEY_RESOURCES);
    if (stored) {
      try {
        this.resources = JSON.parse(stored);
      } catch {
        this.resources = [...MOCK_RESOURCES];
      }
    } else {
      this.resources = [...MOCK_RESOURCES];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(this.resources));
  }

  public getResources(): ResourceItem[] {
    return [...this.resources];
  }

  public getResourceById(id: string): ResourceItem | undefined {
    return this.resources.find(r => r.id === id);
  }

  public getByCategory(category: ResourceCategory): ResourceItem[] {
    return this.resources.filter(r => r.category === category);
  }

  public getAvailableResources(): ResourceItem[] {
    return this.resources.filter(r => r.availableQuantity > 0 && r.status === 'AVAILABLE');
  }

  public addResource(item: Omit<ResourceItem, 'id' | 'lastUpdated'>): ResourceItem {
    const newItem: ResourceItem = {
      ...item,
      id: `res-${Date.now().toString().slice(-4)}`,
      lastUpdated: 'Just now'
    };
    this.resources.unshift(newItem);
    this.save();
    return newItem;
  }

  public updateResource(id: string, updates: Partial<ResourceItem>): ResourceItem | null {
    const res = this.resources.find(r => r.id === id);
    if (!res) return null;

    Object.assign(res, updates, { lastUpdated: 'Just now' });
    this.save();
    return res;
  }

  public updateQuantity(id: string, availableQuantity: number): ResourceItem | null {
    const res = this.resources.find(r => r.id === id);
    if (!res) return null;

    res.availableQuantity = Math.max(0, Math.min(availableQuantity, res.quantity));
    res.status = res.availableQuantity === 0 ? 'DEPLETED' : 'AVAILABLE';
    res.lastUpdated = 'Just now';
    this.save();
    return res;
  }

  public dispatchResource(id: string, count: number = 1): boolean {
    const res = this.resources.find(r => r.id === id);
    if (!res || res.availableQuantity < count) return false;

    res.availableQuantity -= count;
    if (res.availableQuantity === 0) {
      res.status = 'DISPATCHED';
    }
    res.lastUpdated = 'Just now';
    this.save();
    return true;
  }

  public deleteResource(id: string): boolean {
    const len = this.resources.length;
    this.resources = this.resources.filter(r => r.id !== id);
    if (this.resources.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  public getStats() {
    const total = this.resources.length;
    const available = this.resources.filter(r => r.status === 'AVAILABLE').length;
    const dispatched = this.resources.filter(r => r.status === 'DISPATCHED').length;
    const categoriesCount = new Set(this.resources.map(r => r.category)).size;

    return {
      total,
      available,
      dispatched,
      categoriesCount
    };
  }
}

export const resourceService = new ResourceService();
