import React from 'react'
import { useState } from 'react'
import api from '../lib/api'
import Field from '../components/Field'
import Button from '../components/Button'

export default function Company(){
  const [companyId, setCompanyId] = useState('')
  const [mode, setMode] = useState('PRIVATE_JET')

  async function requestFlight(){
    try { const r = await api.post('/bookings', { mode, companyId }); alert('requested') } catch (err:any) { alert(err?.response?.data?.error || 'fail') }
  }

  return (
    <div className="container-mobile p-4">
      <h2 className="text-xl mb-3">Company</h2>
      <Field label="Company ID" value={companyId} onChange={setCompanyId} />
      <Button onClick={requestFlight}>Request Flight (Pay Later)</Button>
    </div>
  )
}
