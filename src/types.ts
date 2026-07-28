export type Language = 'en' | 'bn';
export type AppMode = 'passenger' | 'driver';

export type VehicleType = 'cng' | 'bike' | 'car' | 'rickshaw' | 'microbus';

export interface VehicleOption {
  id: VehicleType;
  name: string;
  nameBn: string;
  icon: string;
  capacity: number;
  baseFare: number;
  perKm: number;
  speedKmH: number;
  etaMins: number;
  description: string;
  descriptionBn: string;
  popularFor: string;
  popularForBn: string;
}

export interface LocationPoint {
  id: string;
  name: string;
  nameBn: string;
  address: string;
  addressBn: string;
  city: 'Dhaka' | 'Chittagong' | 'CoxsBazar' | 'Sylhet';
  lat: number;
  lng: number;
  isPopular?: boolean;
  category?: 'airport' | 'university' | 'hub' | 'beach' | 'shopping' | 'business';
}

export interface Driver {
  id: string;
  name: string;
  nameBn: string;
  avatar: string;
  phone: string;
  rating: number;
  totalRides: number;
  vehicleType: VehicleType;
  vehicleModel: string;
  vehicleNumber: string;
  currentLat: number;
  currentLng: number;
  distanceKm: number;
  bidFareBDT: number;
  estimatedArrivalMins: number;
}

export type RideStatus =
  | 'idle'
  | 'searching'
  | 'bidding'
  | 'driver_assigned'
  | 'driver_arriving'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cash' | 'shuti_wallet';

export interface RideDetails {
  id: string;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  vehicle: VehicleOption;
  fareBDT: number;
  originalFareBDT: number;
  discountBDT: number;
  paymentMethod: PaymentMethod;
  paymentPaid: boolean;
  driver?: Driver;
  status: RideStatus;
  otpCode: string;
  estimatedDurationMins: number;
  distanceKm: number;
  trafficLevel: 'Low' | 'Moderate' | 'Heavy Jams';
  startTime?: string;
  ratingGiven?: number;
  reviewText?: string;
}

export interface RideHistoryItem {
  id: string;
  date: string;
  pickupName: string;
  dropoffName: string;
  vehicleType: VehicleType;
  fareBDT: number;
  driverName: string;
  status: 'Completed' | 'Cancelled';
  paymentMethod: PaymentMethod;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  provider: 'google';
}

export interface AIRouteAdvice {
  trafficStatus: string;
  recommendedRoute: string;
  estimatedMinutes: number;
  distanceKm: number;
  estimatedFareBDT: number;
  aiTips: string;
  safetyRating: string;
}
