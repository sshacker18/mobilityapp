export type RideMode = 'AUTO' | 'CAR' | 'BIKE' | 'SCOOTY' | 'EV'

const perKmRates: Record<RideMode, number> = {
  AUTO: 14,
  CAR: 18,
  BIKE: 10,
  SCOOTY: 9,
  EV: 16
}

export function distanceKm(lat1?: number, lon1?: number, lat2?: number, lon2?: number) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function estimateFare(mode: RideMode, km: number) {
  const rate = perKmRates[mode] || 12
  const base = 20
  return Math.round(base + km * rate)
}
