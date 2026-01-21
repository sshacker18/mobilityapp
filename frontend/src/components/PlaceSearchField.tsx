import React, { useCallback, useRef } from 'react'
import { Autocomplete } from '@react-google-maps/api'

interface PlaceSearchFieldProps {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  onPlaceSelect: (payload: { address: string; lat: number; lng: number }) => void
  isMapsLoaded: boolean
  inputClassName?: string
  labelClassName?: string
  dataTestId?: string
}

export default function PlaceSearchField({
  id,
  label,
  value,
  placeholder,
  onChange,
  onPlaceSelect,
  isMapsLoaded,
  inputClassName,
  labelClassName,
  dataTestId
}: PlaceSearchFieldProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace()
    if (!place?.geometry?.location) return
    const address = place.formatted_address || place.name || value
    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()
    onPlaceSelect({ address, lat, lng })
  }, [onPlaceSelect, value])

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClassName}>{label}</label>
      {isMapsLoaded ? (
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={inputClassName}
            data-testid={dataTestId}
          />
        </Autocomplete>
      ) : (
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={inputClassName}
          data-testid={dataTestId}
        />
      )}
    </div>
  )
}
