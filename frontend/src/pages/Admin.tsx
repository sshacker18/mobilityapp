import React, { useState } from 'react'
import api from '../lib/api'
import Field from '../components/Field'
import Button from '../components/Button'

export default function Admin(){
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')

  async function createDriver(){
    try { await api.post('/admin/create-driver', { phone, name }); alert('ok') } catch (err:any) { alert(err?.response?.data?.error || 'Failed') }
  }

  async function createCompany(){
    try { await api.post('/admin/create-company', { name: companyName, email: companyEmail }); alert('ok') } catch (err:any) { alert('fail') }
  }

  return (
    <div className="container-mobile p-4">
      <h2 className="text-xl mb-3">Admin</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Create Driver</h3>
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Field label="Name" value={name} onChange={setName} />
        <Button onClick={createDriver}>Create Driver</Button>
      </div>
      <div>
        <h3 className="font-medium mb-2">Create Company</h3>
        <Field label="Company name" value={companyName} onChange={setCompanyName} />
        <Field label="Email" value={companyEmail} onChange={setCompanyEmail} />
        <Button onClick={createCompany}>Create Company</Button>
      </div>
    </div>
  )
}
