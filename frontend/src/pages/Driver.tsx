import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Driver(){
  const [available, setAvailable] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])

  async function toggle(v:boolean){
    try { await api.post('/driver/availability', { available: v }); setAvailable(v) } catch {}
  }

  async function updateLoc(){
    navigator.geolocation.getCurrentPosition(async (pos)=>{ await api.post('/driver/location', { lat: pos.coords.latitude, lng: pos.coords.longitude }) })
  }

  useEffect(()=>{ async function load(){ try { const r=await api.get('/driver/bookings'); setBookings(r.data || []) } catch {} } load() }, [])

  return (
    <div className="container-mobile p-4">
      <h2 className="text-xl mb-3">Driver Dashboard</h2>
      <div className="mb-3">Available: {String(available)}</div>
      <button onClick={()=>toggle(!available)} className="mb-2 bg-primary text-white rounded p-2 w-full">Toggle Availability</button>
      <button onClick={updateLoc} className="mb-4 border rounded p-2 w-full">Update Location</button>
      <div>
        <h3 className="font-medium mb-2">Assigned</h3>
        {bookings.length===0 ? <div>No bookings</div> : bookings.map(b=> <div key={b.id} className="p-2 border mb-2">{b.mode} - {b.status}</div>)}
      </div>
    </div>
  )
}
