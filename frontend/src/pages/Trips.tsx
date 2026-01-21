import React, { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Trips(){
  const [bookings, setBookings] = useState<any[]>([])

  async function load(){
    try {
      const res = await api.get('/bookings')
      setBookings(res.data || [])
    } catch {}
  }

  useEffect(()=>{ load(); const t = setInterval(load, 5000); return ()=>clearInterval(t)}, [])

  return (
    <div className="container-mobile p-4">
      <h2 className="text-xl mb-3">Trips</h2>
      {bookings.length === 0 ? <div>No trips yet</div> : (
        <div className="space-y-3">
          {bookings.map(b=> (
            <div key={b.id} className="p-3 border rounded">
              <div className="font-medium">{b.mode} - {b.status}</div>
              <div className="text-sm">Fare: {b.fare || 'N/A'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
