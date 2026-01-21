export interface DriverProfile {
  id: string
  name: string
  mode: 'AUTO' | 'CAR' | 'BIKE' | 'SCOOTY' | 'EV'
  rating: number
  customerScore: number
  safetyScore: number
  drivingScore: number
  vehicleCondition: number
  distanceKm: number
  trips: number
  badge: string
}

export const drivers: DriverProfile[] = [
  {
    id: 'drv-auto-01',
    name: 'Arjun Reddy',
    mode: 'AUTO',
    rating: 4.8,
    customerScore: 4.9,
    safetyScore: 4.7,
    drivingScore: 4.8,
    vehicleCondition: 4.6,
    distanceKm: 1.2,
    trips: 1420,
    badge: 'Top Auto'
  },
  {
    id: 'drv-auto-02',
    name: 'Sai Charan',
    mode: 'AUTO',
    rating: 4.6,
    customerScore: 4.5,
    safetyScore: 4.6,
    drivingScore: 4.7,
    vehicleCondition: 4.4,
    distanceKm: 2.4,
    trips: 980,
    badge: 'Friendly'
  },
  {
    id: 'drv-car-01',
    name: 'Keerthi Rao',
    mode: 'CAR',
    rating: 4.9,
    customerScore: 4.9,
    safetyScore: 4.9,
    drivingScore: 4.8,
    vehicleCondition: 4.9,
    distanceKm: 1.6,
    trips: 2100,
    badge: 'Premium'
  },
  {
    id: 'drv-car-02',
    name: 'Nikhil Varma',
    mode: 'CAR',
    rating: 4.5,
    customerScore: 4.4,
    safetyScore: 4.6,
    drivingScore: 4.5,
    vehicleCondition: 4.5,
    distanceKm: 3.2,
    trips: 750,
    badge: 'Reliable'
  },
  {
    id: 'drv-bike-01',
    name: 'Rohit Das',
    mode: 'BIKE',
    rating: 4.7,
    customerScore: 4.8,
    safetyScore: 4.6,
    drivingScore: 4.7,
    vehicleCondition: 4.5,
    distanceKm: 1.1,
    trips: 1330,
    badge: 'Fast pickup'
  },
  {
    id: 'drv-bike-02',
    name: 'Harsha B',
    mode: 'BIKE',
    rating: 4.4,
    customerScore: 4.3,
    safetyScore: 4.4,
    drivingScore: 4.4,
    vehicleCondition: 4.2,
    distanceKm: 2.8,
    trips: 640,
    badge: 'Budget pick'
  },
  {
    id: 'drv-scooty-01',
    name: 'Meghana S',
    mode: 'SCOOTY',
    rating: 4.6,
    customerScore: 4.7,
    safetyScore: 4.5,
    drivingScore: 4.6,
    vehicleCondition: 4.6,
    distanceKm: 1.9,
    trips: 870,
    badge: 'Smooth ride'
  },
  {
    id: 'drv-scooty-02',
    name: 'Vikram K',
    mode: 'SCOOTY',
    rating: 4.3,
    customerScore: 4.2,
    safetyScore: 4.3,
    drivingScore: 4.4,
    vehicleCondition: 4.1,
    distanceKm: 3.6,
    trips: 510,
    badge: 'Nearby'
  },
  {
    id: 'drv-ev-01',
    name: 'Ananya P',
    mode: 'EV',
    rating: 4.9,
    customerScore: 4.8,
    safetyScore: 4.9,
    drivingScore: 4.9,
    vehicleCondition: 4.8,
    distanceKm: 2.1,
    trips: 940,
    badge: 'Eco favorite'
  },
  {
    id: 'drv-ev-02',
    name: 'Pranav S',
    mode: 'EV',
    rating: 4.6,
    customerScore: 4.5,
    safetyScore: 4.7,
    drivingScore: 4.6,
    vehicleCondition: 4.5,
    distanceKm: 2.9,
    trips: 690,
    badge: 'Quiet ride'
  }
]
