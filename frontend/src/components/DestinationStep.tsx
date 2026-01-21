import React from 'react'
import PlaceSearchField from './PlaceSearchField'

export interface DestinationOption {
  label: string
  value: string
  lat?: number
  lon?: number
}

interface DestinationStepProps {
  value?: DestinationOption | null
  onSelect: (option: DestinationOption | null) => void
  recent: DestinationOption[]
  isMapsLoaded: boolean
}

export default function DestinationStep({ value, onSelect, recent, isMapsLoaded }: DestinationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Choose your destination</h2>
        <p className="text-sm text-slate-300">Search with Google Maps or pick a hotspot.</p>
      </div>
      <div className="space-y-3">
        <PlaceSearchField
          id="destination-input"
          label="Destination"
          value={value?.label || ''}
          placeholder="Search destination"
          onChange={(val) => onSelect(val ? { label: val, value: val } : null)}
          onPlaceSelect={(payload) =>
            onSelect({
              label: payload.address,
              value: payload.address,
              lat: payload.lat,
              lon: payload.lng
            })
          }
          isMapsLoaded={isMapsLoaded}
          inputClassName="wizard-input-dark"
          labelClassName="wizard-label-dark"
          dataTestId="destination-address"
        />
        {!isMapsLoaded && (
          <p className="text-xs text-slate-400">Google Maps key missing. Enter the address manually.</p>
        )}
      </div>
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-slate-300">Recent</div>
        <div className="flex flex-wrap gap-2">
          {recent.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(item)}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200 shadow-soft hover:border-brand"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
