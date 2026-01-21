import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { drivers, DriverProfile } from '../data/drivers'
import { distanceKm, estimateFare } from '../utils/fare'

interface BookingSummary {
  mode: DriverProfile['mode']
  phone: string
  pickup: string
  destination: string
  pickupLat?: number
  pickupLon?: number
  destinationLat?: number
  destinationLon?: number
}

const sorters: Record<string, (a: DriverProfile, b: DriverProfile) => number> = {
  rating: (a, b) => b.rating - a.rating,
  distance: (a, b) => a.distanceKm - b.distanceKm,
  safety: (a, b) => b.safetyScore - a.safetyScore,
  customer: (a, b) => b.customerScore - a.customerScore,
  vehicle: (a, b) => b.vehicleCondition - a.vehicleCondition
}

export default function OrderDetails() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: BookingSummary }
  const [sortKey, setSortKey] = useState('rating')
  const [maxDistance, setMaxDistance] = useState(3)
  const [minRating, setMinRating] = useState(4.5)
  const [minVehicle, setMinVehicle] = useState(4.3)
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null)

  const summary: BookingSummary = state || {
    mode: 'AUTO',
    phone: '+919876543210',
    pickup: 'Hitech City, Hyderabad',
    destination: 'Madhapur, Hyderabad'
  }

  const distance = useMemo(() => {
    const km = distanceKm(summary.pickupLat, summary.pickupLon, summary.destinationLat, summary.destinationLon)
    if (!km) return Math.max(4, Math.min(8, maxDistance + 2))
    return Math.max(2, Math.round(km * 10) / 10)
  }, [summary.pickupLat, summary.pickupLon, summary.destinationLat, summary.destinationLon, maxDistance])

  const fareEstimate = useMemo(() => estimateFare(summary.mode, distance), [summary.mode, distance])
  const etaMinutes = Math.max(3, Math.round(distance * 2))

  const filteredDrivers = useMemo(() => {
    return drivers
      .filter((driver) => driver.mode === summary.mode)
      .filter((driver) => driver.distanceKm <= maxDistance)
      .filter((driver) => driver.rating >= minRating)
      .filter((driver) => driver.vehicleCondition >= minVehicle)
      .sort(sorters[sortKey])
  }, [summary.mode, maxDistance, minRating, minVehicle, sortKey])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50 px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Ride confirmed</span>
          <h1 className="text-2xl font-semibold text-slate-900">Pick your driver</h1>
          <p className="text-sm text-slate-500">
            We found drivers near {summary.pickup}. Filter by safety, customer ratings, and vehicle condition.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
          <div className="wizard-card p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-slate-700">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div><span className="font-semibold text-slate-800">Mode:</span> {summary.mode}</div>
              <div><span className="font-semibold text-slate-800">Phone:</span> {summary.phone}</div>
              <div><span className="font-semibold text-slate-800">Pickup:</span> {summary.pickup}</div>
              <div><span className="font-semibold text-slate-800">Drop:</span> {summary.destination}</div>
              <div><span className="font-semibold text-slate-800">Distance:</span> {distance} km</div>
              <div><span className="font-semibold text-slate-800">ETA:</span> {etaMinutes} min</div>
              <div><span className="font-semibold text-slate-800">Est. fare:</span> ₹{fareEstimate}</div>
            </div>
            <button
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-500"
              onClick={() => navigate('/booking', { state: { mode: summary.mode } })}
            >
              Edit booking
            </button>
          </div>

          <div className="wizard-card p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-wide text-slate-500">
                Sort by
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value)}
                >
                  <option value="rating">Overall rating</option>
                  <option value="distance">Closest</option>
                  <option value="safety">Safety score</option>
                  <option value="customer">Customer care</option>
                  <option value="vehicle">Vehicle condition</option>
                </select>
              </label>
              <label className="text-xs uppercase tracking-wide text-slate-500">
                Max distance ({maxDistance} km)
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={maxDistance}
                  onChange={(event) => setMaxDistance(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </label>
              <label className="text-xs uppercase tracking-wide text-slate-500">
                Minimum rating ({minRating})
                <input
                  type="range"
                  min={4}
                  max={5}
                  step={0.1}
                  value={minRating}
                  onChange={(event) => setMinRating(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </label>
              <label className="text-xs uppercase tracking-wide text-slate-500">
                Vehicle condition ({minVehicle})
                <input
                  type="range"
                  min={4}
                  max={5}
                  step={0.1}
                  value={minVehicle}
                  onChange={(event) => setMinVehicle(Number(event.target.value))}
                  className="mt-3 w-full"
                />
              </label>
            </div>

            <div className="mt-5 space-y-4">
              {filteredDrivers.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No drivers match the filters. Try relaxing the distance or rating.
                </div>
              )}
              {filteredDrivers.map((driver) => (
                <button
                  key={driver.id}
                  className={`flex w-full items-start justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-all ${
                    selectedDriver?.id === driver.id
                      ? 'border-brand bg-brand/10 shadow-soft'
                      : 'border-slate-200 bg-white'
                  }`}
                  onClick={() => setSelectedDriver(driver)}
                  data-testid={`driver-${driver.id}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-slate-900">{driver.name}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{driver.badge}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{driver.distanceKm} km away · {driver.trips} trips</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>Overall: <span className="font-semibold text-slate-700">{driver.rating}</span></div>
                      <div>Customer: <span className="font-semibold text-slate-700">{driver.customerScore}</span></div>
                      <div>Safety: <span className="font-semibold text-slate-700">{driver.safetyScore}</span></div>
                      <div>Vehicle: <span className="font-semibold text-slate-700">{driver.vehicleCondition}</span></div>
                    </div>
                  </div>
                  <div className="text-xl">⭐</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="primary-button"
            disabled={!selectedDriver}
            onClick={() =>
              selectedDriver &&
              navigate('/ride-tracker', {
                state: {
                  mode: summary.mode,
                  driver: selectedDriver,
                  pickup: summary.pickup,
                  destination: summary.destination,
                  fare: fareEstimate,
                  etaMinutes,
                  distanceKm: distance
                }
              })
            }
          >
            {selectedDriver ? `Confirm ${selectedDriver.name}` : 'Select a driver to continue'}
          </button>
          <button
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-500"
            onClick={() => navigate('/home')}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
