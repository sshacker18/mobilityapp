import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useJsApiLoader } from '@react-google-maps/api'
import Stepper from '../components/Stepper'
import LocationStep from '../components/LocationStep'
import DestinationStep, { DestinationOption } from '../components/DestinationStep'
import MapPreview from '../components/MapPreview'

const steps = [
  { id: 'rider', title: 'Rider' },
  { id: 'location', title: 'Pickup' },
  { id: 'destination', title: 'Destination' },
  { id: 'review', title: 'Confirm' }
]

export default function BookingWizard() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  })
  const { state } = useLocation() as { state?: { mode?: string } }
  const { mode: modeParam } = useParams<{ mode?: string }>()
  const navigate = useNavigate()
  const rawMode = (modeParam || state?.mode || 'AUTO').toUpperCase()
  const mode = ['AUTO', 'CAR', 'BIKE', 'SCOOTY', 'EV'].includes(rawMode) ? rawMode : 'AUTO'
  const [activeStep, setActiveStep] = useState(0)
  const [phone, setPhone] = useState('')
  const [riderName, setRiderName] = useState('')
  const [riderPhone, setRiderPhone] = useState('')
  const [location, setLocation] = useState<{ lat?: number; lon?: number; address: string }>({
    address: ''
  })
  const [locationError, setLocationError] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [destination, setDestination] = useState<DestinationOption | null>(null)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const phoneDigits = phone.replace(/\D/g, '')

  const recentDestinations = useMemo(
    () => [
      { label: 'Balapur X Road', value: 'balapur-x-road', lat: 17.3224, lon: 78.4901 },
      { label: 'Santosh Nagar', value: 'santosh-nagar', lat: 17.3354, lon: 78.5076 },
      { label: 'Charminar', value: 'charminar', lat: 17.3616, lon: 78.4747 },
      { label: 'Hitech City', value: 'hitech-city', lat: 17.4435, lon: 78.3772 },
      { label: 'Madhapur', value: 'madhapur', lat: 17.4494, lon: 78.3916 },
      { label: 'Imax', value: 'imax', lat: 17.4169, lon: 78.4694 },
      { label: 'Gachibowli', value: 'gachibowli', lat: 17.4401, lon: 78.3489 }
    ],
    []
  )

  const googleAvailable = isLoaded && Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

  const handleDetectLocation = () => {
    setLocationError('')
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported on this device.')
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        try {
          if (googleAvailable && window.google?.maps) {
            const geocoder = new window.google.maps.Geocoder()
            const { results } = await geocoder.geocode({ location: { lat, lng: lon } })
            const address = results?.[0]?.formatted_address || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
            setLocation({ lat, lon, address })
          } else {
            setLocation({ lat, lon, address: `${lat.toFixed(4)}, ${lon.toFixed(4)}` })
          }
        } catch {
          setLocation({ lat, lon, address: `${lat.toFixed(4)}, ${lon.toFixed(4)}` })
        } finally {
          setLocationLoading(false)
        }
      },
      () => {
        setLocationLoading(false)
        setLocationError('Permission denied. You can enter it manually below.')
      },
      { timeout: 10000 }
    )
  }

  const handleSubmit = async () => {
    setSubmitStatus('submitting')
    const payload = {
      mode,
      phone,
      riderName: riderName.trim() || undefined,
      riderPhone: riderPhone.trim() || undefined,
      otpVerified: true,
      currentLocation: location,
      destination,
      requestedAt: new Date().toISOString()
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiBase}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        throw new Error('submit failed')
      }
      setSubmitStatus('success')
      navigate('/order-details', {
        state: {
          mode,
          phone,
          pickup: location.address,
          destination: destination?.label || '',
          pickupLat: location.lat,
          pickupLon: location.lon,
          destinationLat: destination?.lat,
          destinationLon: destination?.lon
        }
      })
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setSubmitStatus('success')
      navigate('/order-details', {
        state: {
          mode,
          phone,
          pickup: location.address,
          destination: destination?.label || '',
          pickupLat: location.lat,
          pickupLon: location.lon,
          destinationLat: destination?.lat,
          destinationLon: destination?.lon
        }
      })
    }
  }

  const canContinue = useMemo(() => {
    if (activeStep === 0) return phoneDigits.length === 10
    if (activeStep === 1) return Boolean(location.address)
    if (activeStep === 2) return Boolean(destination)
    return true
  }, [activeStep, destination, location.address, phone])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-4 py-8 text-white">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="wizard-card-dark p-4 sm:p-6">
          <Stepper steps={steps} activeStep={activeStep} variant="dark" />
        </div>
        <div className="wizard-card-dark p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="rider"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                  Ride mode: <span data-testid="booking-mode">{mode}</span>
                </div>
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-300">Booking for someone else?</div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="wizard-label-dark">Rider name (optional)</label>
                      <input
                        className="wizard-input-dark mt-2"
                        placeholder="e.g. Mom"
                        value={riderName}
                        onChange={(event) => setRiderName(event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="wizard-label-dark">Rider phone (optional)</label>
                      <input
                        className="wizard-input-dark mt-2"
                        placeholder="e.g. 9876543210"
                        value={riderPhone}
                        onChange={(event) => setRiderPhone(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="wizard-label-dark" htmlFor="booking-phone">Contact number</label>
                  <input
                    id="booking-phone"
                    className="wizard-input-dark"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    inputMode="numeric"
                    maxLength={10}
                    data-testid="booking-phone"
                  />
                  <p className="text-xs text-slate-300">We’ll share trip updates on this number.</p>
                </div>
                <button
                  type="button"
                  className="wizard-button mt-6"
                  onClick={() => setActiveStep(1)}
                  disabled={!canContinue}
                >
                  Continue to pickup
                </button>
              </motion.div>
            )}
            {activeStep === 1 && (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <LocationStep
                  address={location.address}
                  isLoading={locationLoading}
                  error={locationError}
                  onDetect={handleDetectLocation}
                  onManualChange={(value) => setLocation((prev) => ({ ...prev, address: value }))}
                  onPlaceSelect={({ address, lat, lng }) => setLocation({ address, lat, lon: lng })}
                  isMapsLoaded={googleAvailable}
                />
              </motion.div>
            )}
            {activeStep === 2 && (
              <motion.div
                key="destination"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <DestinationStep
                  value={destination}
                  onSelect={setDestination}
                  recent={recentDestinations}
                  isMapsLoaded={googleAvailable}
                />
                <div className="mt-6">
                  <MapPreview
                    current={{ lat: location.lat, lon: location.lon, label: location.address }}
                    destination={{ lat: destination?.lat, lon: destination?.lon, label: destination?.label }}
                    onMapClick={(lat, lng) => {
                      if (!googleAvailable || !window.google?.maps) {
                        setDestination({ label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, value: 'pin', lat, lon: lng })
                        return
                      }
                      const geocoder = new window.google.maps.Geocoder()
                      geocoder.geocode({ location: { lat, lng } }).then(({ results }) => {
                        const address = results?.[0]?.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                        setDestination({ label: address, value: address, lat, lon: lng })
                      })
                    }}
                  />
                </div>
              </motion.div>
            )}
            {activeStep === 3 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Review & submit</h2>
                    <p className="text-sm text-slate-300">Confirm your details before booking.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200 shadow-soft">
                    <div><span className="font-semibold text-white">Mode:</span> {mode}</div>
                    <div><span className="font-semibold text-white">Phone:</span> {phone}</div>
                    {riderName && <div><span className="font-semibold text-white">Rider:</span> {riderName}</div>}
                    {riderPhone && <div><span className="font-semibold text-white">Rider phone:</span> {riderPhone}</div>}
                    <div><span className="font-semibold text-white">Pickup:</span> {location.address}</div>
                    <div>
                      <span className="font-semibold text-white">Destination:</span> {destination?.label || 'Not set'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="wizard-button"
                    onClick={handleSubmit}
                    disabled={submitStatus === 'submitting'}
                  >
                    {submitStatus === 'submitting' ? 'Confirming…' : 'Confirm booking'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {activeStep > 0 && activeStep < 3 && (
          <div className="flex justify-between">
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:border-brand"
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            >
              Back
            </button>
            <button
              type="button"
              className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-dark disabled:opacity-50"
              onClick={() => setActiveStep((prev) => Math.min(3, prev + 1))}
              disabled={!canContinue}
            >
              Next
            </button>
          </div>
        )}
        {activeStep === 3 && (
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:border-brand"
            onClick={() => setActiveStep(2)}
          >
            Edit destination
          </button>
        )}
      </div>
    </div>
  )
}
