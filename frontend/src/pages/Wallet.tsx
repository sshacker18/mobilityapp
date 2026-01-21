import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import Button from '../components/Button'

export default function Wallet(){
  const [wallet, setWallet] = useState<any>(null)
  const [topup, setTopup] = useState<number>(50)

  async function load(){
    try { const res = await api.get('/wallet'); setWallet(res.data) } catch {}
  }

  useEffect(()=>{ load() }, [])

  async function doTopup(){
    try { await api.post('/wallet/topup', { amount: topup }); load() } catch (err:any) { alert(err?.response?.data?.error || 'Failed') }
  }

  return (
    <div className="container-mobile p-4">
      <h2 className="text-xl mb-3">Wallet</h2>
      <div className="mb-3">Balance: {wallet?.balance ?? 'N/A'}</div>
      <div className="mb-3">
        <input type="number" value={topup} onChange={(e)=>setTopup(Number(e.target.value))} className="border rounded p-2" />
        <Button onClick={doTopup} className="mt-2">Top Up</Button>
      </div>
      <div>
        <h3 className="font-medium mb-2">Ledger</h3>
        {wallet?.entries?.length ? wallet.entries.map((l:any)=> (
          <div key={l.id} className="p-2 border-b">{l.createdAt} - {l.type} - {l.amount}</div>
        )) : <div>No entries</div>}
      </div>
    </div>
  )
}
