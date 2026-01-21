import React from 'react'
import PlaceSearchField from './PlaceSearchField'

interface LocationStepProps {
  address: string
  isLoading: boolean
  error?: string
  onDetect: () => void
  onManualChange: (value: string) => void
  onPlaceSelect: (payload: { address: string; lat: number; lng: number }) => void
  isMapsLoaded: boolean
}

export default function LocationStep({
  address,
  isLoading,
  error,
  onDetect,
  onManualChange,
  onPlaceSelect,
  isMapsLoaded
}: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Find your pickup</h2>
        <p className="text-sm text-slate-300">Use Google maps search or drop a pin.</p>
      </div>
      <button type="button" className="wizard-button" onClick={onDetect}>
        {isLoading ? 'Detecting…' : 'Use current location'}
      </button>
      <div className="space-y-3">
        <PlaceSearchField
          id="pickup-address"
          label="Pickup address"
          value={address}
          placeholder="Search pickup (Hyderabad)"
          onChange={onManualChange}
          onPlaceSelect={onPlaceSelect}
          isMapsLoaded={isMapsLoaded}
          inputClassName="wizard-input-dark"
          labelClassName="wizard-label-dark"
          dataTestId="pickup-address"
        />
        {!isMapsLoaded && (
          <p className="text-xs text-slate-400">Google Maps key missing. Enter the address manually.</p>
        )}
        {isLoading && <div className="h-4 w-32 animate-pulse rounded bg-white/10" />}
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>
    </div>
  )
}
