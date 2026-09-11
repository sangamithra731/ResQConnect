import { HelpRequest, HelpRequestStatus, EmergencyRequestType } from '../types/helpRequest';
import { EmergencySeverity, LocationCoordinates } from '../types/emergency';
import { MOCK_HELP_REQUESTS } from './mockData';
import { apiClient } from './apiClient';

const STORAGE_KEY_REQUESTS = 'resq_help_requests';

// Shape returned by RiskIntel's SOSRequest.to_dict() (POST /api/public/sos)
interface BackendSos {
  id: number;
  status: string;
}

class HelpRequestService {
  private requests: HelpRequest[] = [];

  constructor() {
    this.init();
  }

  private init() {
    const stored = localStorage.getItem(STORAGE_KEY_REQUESTS);
    if (stored) {
      try {
        this.requests = JSON.parse(stored);
      } catch {
        this.requests = [...MOCK_HELP_REQUESTS];
      }
    } else {
      this.requests = [...MOCK_HELP_REQUESTS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(this.requests));
  }

  public getRequests(): HelpRequest[] {
    return [...this.requests];
  }

  public getRequestById(id: string): HelpRequest | undefined {
    return this.requests.find(r => r.id === id);
  }

  public getUserRequests(userId: string): HelpRequest[] {
    return this.requests.filter(r => r.requesterId === userId);
  }

  public getActiveSOSRequest(userId: string): HelpRequest | undefined {
    return this.requests.find(r => r.requesterId === userId && r.status !== 'RESOLVED' && r.status !== 'CANCELLED');
  }

  public createSOS(
    userId: string,
    userName: string,
    userPhone: string,
    location: LocationCoordinates
  ): HelpRequest {
    const now = new Date().toISOString();
    const newRequest: HelpRequest = {
      id: `req-sos-${Date.now().toString().slice(-4)}`,
      requesterId: userId,
      requesterName: userName,
      requesterPhone: userPhone,
      emergencyType: 'Rescue',
      priority: 'CRITICAL',
      peopleAffected: 1,
      childrenCount: 0,
      elderlyCount: 0,
      medicalNeedsCount: 0,
      description: 'INSTANT SOS BEACON: Requester triggered one-touch emergency alarm. Immediate dispatch required.',
      location: location,
      status: 'SUBMITTED',
      isSOS: true,
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          actor: userName,
          note: 'One-Touch SOS beacon activated with live GPS coordinates.'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    this.requests.unshift(newRequest);
    this.save();
    this.syncSosToBackend(newRequest, location);
    return newRequest;
  }

  // Fire-and-forget: pushes the SOS beacon to the RiskIntel command-center
  // backend so it shows up on the live command dashboard, then stamps the
  // local record with the backend's id once it succeeds. Never blocks or
  // throws — if the backend isn't configured/reachable the SOS still works
  // as a local-only record.
  private async syncSosToBackend(request: HelpRequest, location: LocationCoordinates): Promise<void> {
    if (!apiClient.isConfigured()) return;
    try {
      const locationLabel = location.address
        || [location.city, location.district, location.state].filter(Boolean).join(', ')
        || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;

      const result = await apiClient.post<{ success: boolean; sos: BackendSos }>('/api/public/sos', {
        reporter: request.requesterName,
        phone: request.requesterPhone,
        location: locationLabel,
        latitude: location.lat,
        longitude: location.lng,
        priority: request.priority
      });

      const req = this.requests.find(r => r.id === request.id);
      if (req && result.success) {
        req.backendSosId = result.sos.id;
        this.save();
      }
    } catch {
      // Backend unreachable/not deployed yet — the SOS remains local-only.
    }
  }

  public createHelpRequest(data: {
    requesterId: string;
    requesterName: string;
    requesterPhone: string;
    emergencyType: EmergencyRequestType;
    priority: EmergencySeverity;
    peopleAffected: number;
    childrenCount: number;
    elderlyCount: number;
    medicalNeedsCount: number;
    description: string;
    location: LocationCoordinates;
    photoUrl?: string;
    voiceNoteDurationSec?: number;
  }): HelpRequest {
    const now = new Date().toISOString();
    const newRequest: HelpRequest = {
      id: `req-${Date.now().toString().slice(-4)}`,
      ...data,
      status: 'SUBMITTED',
      isSOS: false,
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          actor: data.requesterName,
          note: `Help request logged for ${data.emergencyType} (${data.priority} Priority)`
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    this.requests.unshift(newRequest);
    this.save();
    return newRequest;
  }

  public assignHelperAndResource(
    requestId: string,
    actorName: string,
    helperId?: string,
    helperName?: string,
    helperPhone?: string,
    resourceId?: string,
    resourceName?: string
  ): HelpRequest | null {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return null;

    const now = new Date().toISOString();
    req.status = 'ASSIGNED';
    req.assignedHelperId = helperId || req.assignedHelperId;
    req.assignedHelperName = helperName || req.assignedHelperName;
    req.assignedHelperPhone = helperPhone || req.assignedHelperPhone;
    req.assignedResourceId = resourceId || req.assignedResourceId;
    req.assignedResourceName = resourceName || req.assignedResourceName;
    req.updatedAt = now;

    let note = `Assigned by ${actorName}.`;
    if (helperName) note += ` Helper: ${helperName}.`;
    if (resourceName) note += ` Resource: ${resourceName}.`;

    req.timeline.push({
      status: 'ASSIGNED',
      timestamp: now,
      actor: actorName,
      note
    });

    this.save();
    return req;
  }

  public updateStatus(
    requestId: string,
    newStatus: HelpRequestStatus,
    actorName: string,
    note?: string
  ): HelpRequest | null {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return null;

    const now = new Date().toISOString();
    req.status = newStatus;
    req.updatedAt = now;

    req.timeline.push({
      status: newStatus,
      timestamp: now,
      actor: actorName,
      note: note || `Status updated to ${newStatus}`
    });

    this.save();
    return req;
  }

  public getStats() {
    const total = this.requests.length;
    const critical = this.requests.filter(r => r.priority === 'CRITICAL').length;
    const high = this.requests.filter(r => r.priority === 'HIGH').length;
    const medium = this.requests.filter(r => r.priority === 'MEDIUM').length;
    const low = this.requests.filter(r => r.priority === 'LOW').length;

    const submitted = this.requests.filter(r => r.status === 'SUBMITTED').length;
    const assigned = this.requests.filter(r => r.status === 'ASSIGNED').length;
    const responding = this.requests.filter(r => r.status === 'RESPONDING').length;
    const resolved = this.requests.filter(r => r.status === 'RESOLVED' || r.status === 'ASSISTANCE_PROVIDED').length;

    return {
      total,
      critical,
      high,
      medium,
      low,
      submitted,
      assigned,
      responding,
      resolved
    };
  }
}

export const helpRequestService = new HelpRequestService();
