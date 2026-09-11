import { LocationCoordinates } from '../types/emergency';
import { INDIAN_STATES } from '../types/common';

class LocationService {
  private mockUserLocation: LocationCoordinates = {
    lat: 12.9815,
    lng: 80.2209,
    address: 'Lake View Colony, 2nd Main Road, Velachery',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu'
  };

  public getCurrentLocation(): Promise<LocationCoordinates> {
    return new Promise((resolve) => {
      // Return simulated accurate GPS coordinates
      setTimeout(() => {
        resolve({ ...this.mockUserLocation });
      }, 200);
    });
  }

  public setMockLocation(coords: LocationCoordinates) {
    this.mockUserLocation = coords;
  }

  public calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  public getStates() {
    return INDIAN_STATES;
  }

  public getDistrictsByState(stateName: string): string[] {
    const found = INDIAN_STATES.find(s => s.state.toLowerCase() === stateName.toLowerCase());
    return found ? found.districts : ['Central', 'North', 'South', 'East', 'West'];
  }
}

export const locationService = new LocationService();
