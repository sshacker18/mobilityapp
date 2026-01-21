export type VehicleType = 'Auto' | 'Car' | 'Bike' | 'Scooty' | 'EV';

export interface DriverProfile {
  id: string;
  name: string;
  rating: number;
  vehicleType: VehicleType;
  vehicleNumber: string;
  condition: 'Excellent' | 'Good' | 'Fair';
  etaMinutes: number;
}

export interface BookingDetails {
  riderName: string;
  riderPhone: string;
  pickup: string;
  destination: string;
  vehicleType: VehicleType;
  distanceKm: number;
  fareEstimate: number;
}
