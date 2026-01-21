import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { DriverProfile } from '../data/drivers'

interface RideState {
  mode: DriverProfile['mode']
  driver: DriverProfile
  pickup: string
  destination: string
  fare: number
  etaMinutes: number
  distanceKm: number
}

export default function RideTracker() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state?: RideState }
  const [rideStarted, setRideStarted] = useState(false)
  const [progress, setProgress] = useState(0)

  const ride = useMemo<RideState>(() => {
    if (state) return state
    return {
      mode: 'AUTO',
      driver: {
        id: 'fallback',
        name: 'Hyderabad Driver',
        mode: 'AUTO',
        rating: 4.7,
        customerScore: 4.6,
        safetyScore: 4.7,
        drivingScore: 4.8,
        vehicleCondition: 4.5,
        distanceKm: 1.3,
        trips: 900,
        badge: 'Top Auto'
      },
      pickup: 'Hitech City, Hyderabad',
      destination: 'Madhapur, Hyderabad',
      fare: 129,
      etaMinutes: 6,
      distanceKm: 5.8
    }
  }, [state])

  useEffect(() => {
    if (!rideStarted) return
    const interval = window.setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 8))
    }, 1200)
    return () => window.clearInterval(interval)
  }, [rideStarted])

  useEffect(() => {
    if (progress >= 100) {
      const timer = window.setTimeout(() => {
        navigate('/home')
      }, 2500)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [progress, navigate])

  const status = progress < 100 ? 'On the way' : 'Arrived'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-4 py-8 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-300">Live ride tracker</span>
          <h1 className="text-2xl font-semibold">{ride.mode} ride · {status}</h1>
          <p className="text-sm text-slate-300">
            Fast rides, low fares. Track your driver in real time.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Driver</div>
                <div className="text-xl font-semibold">{ride.driver.name}</div>
                <div className="text-xs text-slate-300">{ride.driver.badge} · ⭐ {ride.driver.rating}</div>
              </div>
              <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm">ETA {ride.etaMinutes} min</div>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Pickup</span>
                <span className="font-medium text-white">{ride.pickup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Drop</span>
                <span className="font-medium text-white">{ride.destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Distance</span>
                <span className="font-medium text-white">{ride.distanceKm.toFixed(1)} km</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Live progress</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 sm:p-6 shadow-2xl">
            <div className="text-sm uppercase tracking-[0.25em] text-slate-300">Ride control</div>
            <p className="mt-2 text-sm text-slate-300">Start the ride once the driver arrives at pickup.</p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-xs text-slate-300">Status</div>
              <div className="mt-2 text-2xl font-semibold">
                {rideStarted ? 'Ride in progress' : 'Driver arrived'}
              </div>
            </div>

            <button
              className="primary-button mt-4"
              onClick={() => setRideStarted(true)}
              disabled={rideStarted}
            >
              {rideStarted ? 'Ride started' : 'Start ride'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-400/40 bg-emerald-400/10 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-200">Low fare promise</div>
              <div className="text-xl font-semibold">₹{ride.fare.toFixed(0)} total</div>
              <div className="text-xs text-emerald-100">
                {progress >= 100 ? 'Payment confirmed · Ride completed' : 'No surge, super fast rides in Hyderabad.'}
              </div>
            </div>
            {progress >= 100 && (
              <button
                className="rounded-2xl border border-emerald-300/40 px-4 py-2 text-xs text-emerald-100"
                onClick={() => navigate('/trips')}
              >
                View trips
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
