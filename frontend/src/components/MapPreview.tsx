import React, { useMemo } from 'react'
import { GoogleMap, Marker } from '@react-google-maps/api'

interface MapPreviewProps {
  current?: { lat?: number; lon?: number; label?: string }
  destination?: { lat?: number; lon?: number; label?: string }
  onMapClick?: (lat: number, lng: number) => void
}

export default function MapPreview({ current, destination, onMapClick }: MapPreviewProps) {
  const center = useMemo(() => {
    if (destination?.lat && destination?.lon) return [destination.lat, destination.lon] as [number, number]
    if (current?.lat && current?.lon) return [current.lat, current.lon] as [number, number]
    return [37.7749, -122.4194] as [number, number]
  }, [current, destination])

  const mapCenter = { lat: center[0], lng: center[1] }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 shadow-soft">
      <GoogleMap
        center={mapCenter}
        zoom={13}
        mapContainerClassName="h-64 w-full"
        onClick={(event) => {
          if (!event.latLng || !onMapClick) return
          onMapClick(event.latLng.lat(), event.latLng.lng())
        }}
        options={{
          disableDefaultUI: true,
          clickableIcons: false
        }}
      >
        {current?.lat && current?.lon && (
          <Marker position={{ lat: current.lat, lng: current.lon }} />
        )}
        {destination?.lat && destination?.lon && (
          <Marker position={{ lat: destination.lat, lng: destination.lon }} />
        )}
      </GoogleMap>
    </div>
  )
}
