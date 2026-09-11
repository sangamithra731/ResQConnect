export interface IndianStateGeo {
  state: string;
  districts: string[];
}

export const INDIAN_STATES: IndianStateGeo[] = [
  {
    state: 'Tamil Nadu',
    districts: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Kanchipuram', 'Cuddalore']
  },
  {
    state: 'Kerala',
    districts: ['Wayanad', 'Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Idukki', 'Alappuzha', 'Palakkad']
  },
  {
    state: 'Odisha',
    districts: ['Puri', 'Bhubaneswar', 'Cuttack', 'Balasore', 'Ganjam', 'Bhadrak', 'Kendrapara']
  },
  {
    state: 'Maharashtra',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Kolhapur', 'Raigad', 'Ratnagiri']
  },
  {
    state: 'Delhi NCR',
    districts: ['Central Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi']
  },
  {
    state: 'Karnataka',
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dakshina Kannada', 'Udupi', 'Belagavi']
  },
  {
    state: 'Andhra Pradesh',
    districts: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati', 'East Godavari']
  },
  {
    state: 'Assam',
    districts: ['Guwahati', 'Kamrup', 'Dibrugarh', 'Silchar', 'Jorhat', 'Cachar', 'Nagaon']
  }
];

export interface AppSettings {
  notifications: {
    emergencyAlerts: boolean;
    helpRequestUpdates: boolean;
    govUpdates: boolean;
    donationUpdates: boolean;
    helperNotifications: boolean;
  };
  emergency: {
    emergencyAlarmSound: boolean;
    vibration: boolean;
    flashAlert: boolean;
    soundEffects: boolean;
  };
  location: {
    locationSharing: boolean;
    nearbyHelpBeacon: boolean;
  };
  appearance: {
    darkMode: boolean;
    deviceFrameMode: boolean;
  };
  privacy: {
    profileVisibility: boolean;
    activitySharing: boolean;
  };
}
