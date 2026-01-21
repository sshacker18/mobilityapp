import { VehicleType } from '../types';

const rates: Record<VehicleType, number> = {
  Auto: 12,
  Car: 18,
  Bike: 9,
  Scooty: 8,
  EV: 16,
};

export const estimateFare = (distanceKm: number, vehicleType: VehicleType): number => {
  const base = 28;
  const perKm = rates[vehicleType] ?? 14;
  return Math.max(base, Math.round((base + distanceKm * perKm) * 10) / 10);
};

export const formatInr = (value: number): string => `₹${value.toFixed(1)}`;

export const haversineKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};
