import { UserProfile } from '../types/user';
import { EmergencyAlert, AlarmAcknowledgement } from '../types/emergency';
import { HelpRequest } from '../types/helpRequest';
import { ResourceItem } from '../types/resource';
import { HelperProfile } from '../types/helper';
import { ReliefCampaign, DonationRecord, StateDonationSummary } from '../types/donation';
import { AppNotification } from '../types/notification';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-citizen-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98401 23456',
    role: 'citizen',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Velachery',
    area: 'Lake View Colony, 2nd Main Road',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    verificationBadge: 'Aadhaar Verified',
    emergencyContacts: [
      { id: 'ec-1', name: 'Dr. Priya Sharma', relationship: 'Spouse', phone: '+91 98401 98765', isPrimary: true },
      { id: 'ec-2', name: 'Ramesh Sharma', relationship: 'Brother', phone: '+91 98402 11223', isPrimary: false }
    ],
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'user-gov-1',
    name: 'Dr. Meenakshi Sundaram, IAS',
    email: 'm.sundaram@tndisaster.gov.in',
    phone: '+91 94440 12345',
    role: 'government',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Chennai Central',
    designation: 'Special Commissioner of Disaster Management',
    department: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    verificationBadge: 'Government Verified ID #TN-SDMA-089',
    emergencyContacts: [
      { id: 'ec-gov-1', name: 'State Emergency Operations Center (SEOC)', relationship: 'Official', phone: '1070', isPrimary: true }
    ],
    createdAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'user-helper-1',
    name: 'Vikram Rathore',
    email: 'vikram.rathore@rescuevolunteers.org',
    phone: '+91 98840 55667',
    role: 'helper',
    state: 'Tamil Nadu',
    district: 'Chennai',
    city: 'Adyar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isVerified: true,
    verificationBadge: 'Red Cross & NDRF Certified First Responder',
    skills: ['Swift Water Rescue', 'First Aid & CPR', 'Trauma Triage', 'Inflatable Boat Pilot'],
    emergencyContacts: [
      { id: 'ec-hlp-1', name: 'Red Cross HQ Control', relationship: 'Organization', phone: '044-28554567', isPrimary: true }
    ],
    createdAt: '2025-12-01T14:30:00Z'
  }
];

export const MOCK_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-flood-01',
    title: 'Severe Flash Flood Warning — Velachery & Adyar Basin',
    type: 'Flood',
    severity: 'CRITICAL',
    headline: 'IMMEDIATE EVACUATION ADVISED: Chembarambakkam outflow raised to 12,000 cusecs',
    description: 'Heavy rainfall exceeding 240mm in past 6 hours has caused localized urban inundation in South Chennai. Water levels in Adyar river approaching warning level. Low-lying areas in Velachery, Madipakkam, and Mudichur are severely affected.',
    recommendedAction: 'Move to upper floors or nearest designated Greater Chennai Corporation relief camp immediately. Disconnect electrical mains. Do not walk through flood waters.',
    targetState: 'Tamil Nadu',
    targetDistrict: 'Chennai',
    targetCity: 'South Chennai',
    targetArea: 'Velachery, Adyar, Madipakkam, Saidapet',
    coordinates: { lat: 12.9815, lng: 80.2209, address: 'Velachery Main Road & 100ft Bypass' },
    broadcastTime: '2026-09-02T11:30:00Z',
    issuerName: 'Dr. Meenakshi Sundaram, IAS',
    issuerDepartment: 'State Disaster Management Authority (TNSDMA)',
    isActive: true,
    requiresAlarm: true,
    affectedPopulationEstimate: 145000,
    acknowledgedCount: 98420,
    totalTargetedUsers: 112000
  },
  {
    id: 'alert-cyclone-02',
    title: 'Cyclone Dana Coastal Advisory — Wind Gusts 95-110 km/h',
    type: 'Cyclone / Storm',
    severity: 'HIGH',
    headline: 'Red alert issued for coastal districts: Fishermen warned not to venture into sea',
    description: 'Severe Cyclonic Storm situated 180km East-Southeast of Chennai moving North-Northwest. Heavy to very heavy rainfall expected across coastal belts.',
    recommendedAction: 'Store potable water and dry rations for 48 hours. Keep mobile devices and powerbanks fully charged. Avoid outdoor transit.',
    targetState: 'Tamil Nadu',
    targetDistrict: 'Chennai',
    targetCity: 'Coastal Corridor',
    targetArea: 'Royapuram, Marina Beach, Ennore Port Corridor',
    coordinates: { lat: 13.0827, lng: 80.2707, address: 'Chennai Port & Coastal Belt' },
    broadcastTime: '2026-09-02T08:00:00Z',
    issuerName: 'India Meteorological Department & TNSDMA',
    issuerDepartment: 'IMD Regional Meteorological Centre',
    isActive: true,
    requiresAlarm: false,
    affectedPopulationEstimate: 320000,
    acknowledgedCount: 245000,
    totalTargetedUsers: 280000
  },
  {
    id: 'alert-landslide-03',
    title: 'Wayanad Ghat Landslide Alert — Traffic Suspended',
    type: 'Earthquake / Landslide',
    severity: 'HIGH',
    headline: 'Multiple mudslips reported on Thamarassery Ghat Road NH-766',
    description: 'Continuous torrential rains have triggered minor debris flows along curves 7 and 8 of the Ghat road.',
    recommendedAction: 'Use alternate Nilambur-Gudalur route. High vigilance near unstable slope cuts.',
    targetState: 'Kerala',
    targetDistrict: 'Wayanad',
    targetCity: 'Vythiri',
    targetArea: 'Thamarassery Ghat & Meppadi belt',
    coordinates: { lat: 11.5534, lng: 76.0125, address: 'Vythiri Ghat Road' },
    broadcastTime: '2026-09-01T18:00:00Z',
    issuerName: 'District Collector & Chairman DDMA Wayanad',
    issuerDepartment: 'Kerala State Disaster Management Authority',
    isActive: true,
    requiresAlarm: false,
    affectedPopulationEstimate: 45000,
    acknowledgedCount: 38200,
    totalTargetedUsers: 42000
  }
];

export const MOCK_HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'req-101',
    requesterId: 'user-citizen-1',
    requesterName: 'Aarav Sharma',
    requesterPhone: '+91 98401 23456',
    emergencyType: 'Flood',
    priority: 'CRITICAL',
    peopleAffected: 4,
    childrenCount: 1,
    elderlyCount: 1,
    medicalNeedsCount: 1,
    description: 'Water has reached 4.5 feet inside ground floor. Elderly mother requires continuous oxygen concentrator support. Battery backup has only 1 hour left. Need rescue boat immediately.',
    location: {
      lat: 12.9815,
      lng: 80.2209,
      address: 'Plot 42, 2nd Cross Street, Lake View Colony, Velachery, Chennai',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu'
    },
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=80',
    voiceNoteDurationSec: 18,
    status: 'RESPONDING',
    assignedHelperId: 'user-helper-1',
    assignedHelperName: 'Vikram Rathore',
    assignedHelperPhone: '+91 98840 55667',
    assignedResourceId: 'res-boat-1',
    assignedResourceName: 'NDRF Inflatable Zodiac Boat Unit #04',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-09-02T11:45:00Z', actor: 'Aarav Sharma', note: 'Distress request logged via SOS beacon' },
      { status: 'ASSIGNED', timestamp: '2026-09-02T11:48:30Z', actor: 'TNSDMA Control Room', note: 'Assigned NDRF Boat Unit #04 and First Responder Vikram Rathore' },
      { status: 'RESPONDING', timestamp: '2026-09-02T11:52:00Z', actor: 'Vikram Rathore', note: 'En route with portable oxygen cylinder and life jackets. ETA 8 minutes.' }
    ],
    createdAt: '2026-09-02T11:45:00Z',
    updatedAt: '2026-09-02T11:52:00Z',
    isSOS: true
  },
  {
    id: 'req-102',
    requesterId: 'user-citizen-2',
    requesterName: 'Kavitha Ramalingam',
    requesterPhone: '+91 94441 98765',
    emergencyType: 'Medical',
    priority: 'HIGH',
    peopleAffected: 2,
    childrenCount: 0,
    elderlyCount: 1,
    medicalNeedsCount: 1,
    description: 'Diabetic senior citizen suffering severe chest pain. Roads are waterlogged, private cabs unavailable.',
    location: {
      lat: 12.9698,
      lng: 80.2012,
      address: 'No 15, AGS Colony, Madipakkam, Chennai',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu'
    },
    status: 'ASSIGNED',
    assignedResourceId: 'res-amb-1',
    assignedResourceName: 'Apollo Advanced Life Support Ambulance #12',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-09-02T11:20:00Z', actor: 'Kavitha Ramalingam', note: 'Urgent medical assistance requested' },
      { status: 'ASSIGNED', timestamp: '2026-09-02T11:25:00Z', actor: '108 Dispatch Desk', note: 'ALS Ambulance #12 dispatched with paramedic team' }
    ],
    createdAt: '2026-09-02T11:20:00Z',
    updatedAt: '2026-09-02T11:25:00Z',
    isSOS: false
  },
  {
    id: 'req-103',
    requesterId: 'user-citizen-3',
    requesterName: 'Manoj Kumar',
    requesterPhone: '+91 98410 33445',
    emergencyType: 'Food & Water',
    priority: 'MEDIUM',
    peopleAffected: 8,
    childrenCount: 3,
    elderlyCount: 2,
    medicalNeedsCount: 0,
    description: 'Apartment complex terrace stranded for 18 hours without drinking water and baby food.',
    location: {
      lat: 12.9912,
      lng: 80.2185,
      address: 'Shanti Apartments, Ram Nagar South, Velachery',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu'
    },
    status: 'SUBMITTED',
    timeline: [
      { status: 'SUBMITTED', timestamp: '2026-09-02T10:15:00Z', actor: 'Manoj Kumar', note: 'Ration request submitted' }
    ],
    createdAt: '2026-09-02T10:15:00Z',
    updatedAt: '2026-09-02T10:15:00Z',
    isSOS: false
  }
];

export const MOCK_RESOURCES: ResourceItem[] = [
  {
    id: 'res-amb-1',
    name: 'Apollo Advanced Life Support Ambulance #12',
    category: 'Ambulance',
    quantity: 15,
    availableQuantity: 4,
    unit: 'Vehicles',
    location: { lat: 12.9815, lng: 80.2209, address: 'Apollo Speciality Hospitals, Vanagaram / OMR Base' },
    distanceKm: 2.1,
    contactPerson: 'Dr. Suresh Kumar (EMS Coordinator)',
    contactPhone: '108',
    status: 'AVAILABLE',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lastUpdated: '5 mins ago',
    notes: 'Equipped with portable ventilator, defibrillator, cardiac monitor and paramedic.'
  },
  {
    id: 'res-boat-1',
    name: 'NDRF Inflatable Zodiac Boat Unit #04',
    category: 'Rescue Team',
    quantity: 8,
    availableQuantity: 2,
    unit: 'Boats',
    location: { lat: 12.9780, lng: 80.2210, address: 'NDRF 4th Battalion Rescue Depot, Adyar Depot' },
    distanceKm: 1.4,
    contactPerson: 'Inspector R. K. Singh',
    contactPhone: '+91 94440 98765',
    status: 'AVAILABLE',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lastUpdated: '2 mins ago',
    notes: 'Motorized inflatable craft with life jackets, thermal blankets and rope throw bags.'
  },
  {
    id: 'res-hosp-1',
    name: 'Government Multi Super Speciality Hospital — Omandurar',
    category: 'Hospital',
    quantity: 450,
    availableQuantity: 82,
    unit: 'Emergency Beds',
    location: { lat: 13.0694, lng: 80.2748, address: 'Anna Salai, Triplicane, Chennai' },
    distanceKm: 6.8,
    contactPerson: 'Emergency Triage Duty Officer',
    contactPhone: '044-25305000',
    status: 'AVAILABLE',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lastUpdated: '10 mins ago',
    notes: '24/7 Trauma ICU, Blood Bank and Burn Unit operational.'
  },
  {
    id: 'res-shelter-1',
    name: 'Greater Chennai Corporation Relief Camp #14',
    category: 'Shelter',
    quantity: 500,
    availableQuantity: 210,
    unit: 'People Capacity',
    location: { lat: 12.9712, lng: 80.2195, address: 'Chennai Middle School, Gandhi Road, Velachery' },
    distanceKm: 0.9,
    contactPerson: 'Zonal Relief Officer Anbarasan',
    contactPhone: '+91 94451 90014',
    status: 'AVAILABLE',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lastUpdated: '15 mins ago',
    notes: 'Dry beds, warm meals, clean water, baby food and power backup generator operational.'
  },
  {
    id: 'res-fire-1',
    name: 'Tamil Nadu Fire and Rescue Services (TNFRS) Station — Guindy',
    category: 'Fire & Rescue',
    quantity: 6,
    availableQuantity: 3,
    unit: 'Fire Engines / High-power pumps',
    location: { lat: 13.0067, lng: 80.2025, address: 'GST Road, Guindy, Chennai' },
    distanceKm: 3.5,
    contactPerson: 'Station Fire Officer Murugan',
    contactPhone: '101',
    status: 'AVAILABLE',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lastUpdated: '8 mins ago',
    notes: 'Equipped with de-watering heavy diesel pumps and hydraulic extrication cutters.'
  },
  {
    id: 'res-food-1',
    name: 'TNSDMA Ready-to-Eat Ration Pack Storage Hub',
    category: 'Food Supplies',
    quantity: 10000,
    availableQuantity: 6400,
    unit: 'Food Kits (3 meals each)',
    location: { lat: 13.0110, lng: 80.2100, address: 'Civil Supplies Warehouse, Saidapet, Chennai' },
    distanceKm: 2.8,
    contactPerson: 'Civil Supplies Officer K. Vasanth',
    contactPhone: '1967',
    status: 'AVAILABLE',
    district: 'Chennai',
    state: 'Tamil Nadu',
    lastUpdated: '20 mins ago',
    notes: 'Includes high-protein biscuits, ready-to-eat khichdi, ORS packets, baby milk formula.'
  }
];

export const MOCK_HELPERS: HelperProfile[] = [
  {
    id: 'user-helper-1',
    name: 'Vikram Rathore',
    phone: '+91 98840 55667',
    email: 'vikram.rathore@rescuevolunteers.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    skills: ['Swift Water Rescue', 'First Aid & CPR', 'Trauma Triage', 'Inflatable Boat Pilot'],
    isVerified: true,
    verificationBadge: 'Red Cross & NDRF Certified First Responder',
    availability: 'AVAILABLE',
    rating: 4.9,
    reviewCount: 42,
    completedMissions: 38,
    avgResponseTimeMin: 7.2,
    location: { lat: 12.9850, lng: 80.2250, address: 'Adyar Rescue Base Camp, Chennai' },
    distanceKm: 1.2,
    activeMissionId: 'req-101',
    badges: ['Top Responder 2025', 'Water Rescue Expert', 'Gold Life Saver']
  },
  {
    id: 'user-helper-2',
    name: 'Dr. Ananya Iyer',
    phone: '+91 98409 88776',
    email: 'dr.ananya@doctorswithoutborders.in',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    skills: ['Emergency Medicine', 'Pediatric Care', 'Triage Assessment', 'Oxygen Administration'],
    isVerified: true,
    verificationBadge: 'IMA Registered Emergency Physician',
    availability: 'AVAILABLE',
    rating: 5.0,
    reviewCount: 56,
    completedMissions: 51,
    avgResponseTimeMin: 5.8,
    location: { lat: 12.9900, lng: 80.2100, address: 'Fortis Malar Emergency Annex' },
    distanceKm: 2.4,
    badges: ['Physician On Wheels', 'Trauma Expert', '50+ Rescues']
  },
  {
    id: 'user-helper-3',
    name: 'Karthik Subramanian',
    phone: '+91 97910 12345',
    email: 'karthik.s@hamradio-india.org',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    skills: ['HAM Radio Operator', 'Off-grid Satellite Comms', 'Drone Aerial Reconnaissance', 'Logistics'],
    isVerified: true,
    verificationBadge: 'Amateur Radio Call Sign VU2KRT Verified',
    availability: 'AVAILABLE',
    rating: 4.8,
    reviewCount: 29,
    completedMissions: 24,
    avgResponseTimeMin: 9.0,
    location: { lat: 12.9750, lng: 80.2300, address: 'Taramani Disaster Comms Post' },
    distanceKm: 1.8,
    badges: ['Comms Champion', 'Drone Pilot']
  }
];

export const MOCK_CAMPAIGNS: ReliefCampaign[] = [
  {
    id: 'camp-chennai-floods-2026',
    title: 'Chennai Flash Flood Emergency Relief Fund 2026',
    description: 'Providing immediate hot meals, bottled water, rescue inflatable rafts, dry blankets, and essential pediatric medical supplies to thousands of inundated families in South Chennai and suburban lowlands.',
    category: 'Flood Relief',
    state: 'Tamil Nadu',
    district: 'Chennai',
    goalAmount: 10000000,
    raisedAmount: 7425000,
    donorsCount: 3840,
    bannerImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80',
    isUrgent: true,
    organizer: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    createdAt: '2026-08-25T00:00:00Z',
    matchedByGovt: true
  },
  {
    id: 'camp-wayanad-landslide-2026',
    title: 'Wayanad Landslide Rehabilitation & Medical Aid',
    description: 'Supporting temporary shelter housing, trauma care kits, and geological restoration for displaced mountain hamlets in Meppadi & Chooralmala.',
    category: 'Landslide Relief',
    state: 'Kerala',
    district: 'Wayanad',
    goalAmount: 15000000,
    raisedAmount: 11890000,
    donorsCount: 6120,
    bannerImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    isUrgent: true,
    organizer: 'Kerala Chief Minister’s Distress Relief Fund (CMDRF)',
    createdAt: '2026-08-10T00:00:00Z',
    matchedByGovt: true
  },
  {
    id: 'camp-cyclone-dana-2026',
    title: 'Cyclone Dana Coastal Relief & Shelter Kits',
    description: 'Emergency tarp shelters, non-perishable rations, solar lanterns, and coastal protection kits for vulnerable fishing communities.',
    category: 'Cyclone Relief',
    state: 'Odisha',
    district: 'Puri & Balasore',
    goalAmount: 8000000,
    raisedAmount: 5120000,
    donorsCount: 2940,
    bannerImage: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&auto=format&fit=crop&q=80',
    isUrgent: false,
    organizer: 'Odisha State Disaster Management Authority (OSDMA)',
    createdAt: '2026-08-20T00:00:00Z',
    matchedByGovt: false
  }
];

export const MOCK_DONATIONS: DonationRecord[] = [
  {
    id: 'don-001',
    campaignId: 'camp-chennai-floods-2026',
    campaignTitle: 'Chennai Flash Flood Emergency Relief Fund 2026',
    donorName: 'Aarav Sharma',
    donorEmail: 'aarav.sharma@example.com',
    donorPhone: '+91 98401 23456',
    amount: 2500,
    paymentMethod: 'UPI',
    status: 'SUCCESS',
    transactionId: 'TXN-UPI-984012849102',
    receiptNumber: 'RC-2026-0902-8419',
    timestamp: '2026-09-02T10:15:00Z',
    state: 'Tamil Nadu',
    isAnonymous: false
  },
  {
    id: 'don-002',
    campaignId: 'camp-chennai-floods-2026',
    campaignTitle: 'Chennai Flash Flood Emergency Relief Fund 2026',
    donorName: 'Sundar Pichai (CSR)',
    donorEmail: 'corp-donations@company.com',
    donorPhone: '+91 99000 11111',
    amount: 100000,
    paymentMethod: 'Net Banking',
    status: 'SUCCESS',
    transactionId: 'TXN-HDFC-9918237461',
    receiptNumber: 'RC-2026-0902-1002',
    timestamp: '2026-09-02T09:40:00Z',
    state: 'Tamil Nadu',
    isAnonymous: false
  },
  {
    id: 'don-003',
    campaignId: 'camp-wayanad-landslide-2026',
    campaignTitle: 'Wayanad Landslide Rehabilitation & Medical Aid',
    donorName: 'Anonymous Good Samaritan',
    donorEmail: 'supporter@community.org',
    donorPhone: '+91 94444 55555',
    amount: 5000,
    paymentMethod: 'Credit / Debit Card',
    status: 'SUCCESS',
    transactionId: 'TXN-CARD-8837192044',
    receiptNumber: 'RC-2026-0902-7711',
    timestamp: '2026-09-02T08:30:00Z',
    state: 'Kerala',
    isAnonymous: true
  }
];

export const MOCK_STATE_DONATIONS: StateDonationSummary[] = [
  { state: 'Tamil Nadu', totalAmount: 8240000, donorCount: 4210, percentage: 34 },
  { state: 'Kerala', totalAmount: 5410000, donorCount: 2980, percentage: 22 },
  { state: 'Karnataka', totalAmount: 3120000, donorCount: 1650, percentage: 13 },
  { state: 'Maharashtra', totalAmount: 1450000, donorCount: 920, percentage: 6 },
  { state: 'Odisha', totalAmount: 6180000, donorCount: 3140, percentage: 25 }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    category: 'EMERGENCY_ALERT',
    title: '🚨 CRITICAL RED ALERT: Velachery Flood Advisory',
    message: 'Chembarambakkam reservoir outflow raised to 12,000 cusecs. Evacuate ground floors immediately.',
    timestamp: '15 mins ago',
    isRead: false,
    relatedId: 'alert-flood-01',
    priority: 'URGENT'
  },
  {
    id: 'notif-2',
    category: 'HELP_REQUEST',
    title: '🤝 First Responder Dispatched to your Request #101',
    message: 'Responder Vikram Rathore (NDRF Certified) is en route with rescue boat. ETA 8 mins.',
    timestamp: '25 mins ago',
    isRead: false,
    relatedId: 'req-101',
    priority: 'HIGH'
  },
  {
    id: 'notif-3',
    category: 'DONATION',
    title: '💰 Donation Receipt Generated',
    message: 'Thank you for your generous contribution of ₹2,500 towards Chennai Flash Flood Relief.',
    timestamp: '1 hour ago',
    isRead: true,
    relatedId: 'don-001',
    priority: 'NORMAL'
  },
  {
    id: 'notif-4',
    category: 'GOV_UPDATE',
    title: '🏛️ GCC Corporation Relief Center Operational',
    message: 'Chennai Middle School Velachery camp is stocked with fresh meals, dry beds, and doctor teams.',
    timestamp: '2 hours ago',
    isRead: true,
    priority: 'NORMAL'
  }
];

export const MOCK_ACKNOWLEDGEMENTS: AlarmAcknowledgement[] = [
  {
    id: 'ack-1',
    alertId: 'alert-flood-01',
    alertTitle: 'Severe Flash Flood Warning — Velachery & Adyar Basin',
    userId: 'user-citizen-1',
    userName: 'Aarav Sharma',
    role: 'citizen',
    receivedTime: '2026-09-02T11:30:02Z',
    acknowledgedTime: '2026-09-02T11:30:14Z',
    isAcknowledged: true
  }
];
