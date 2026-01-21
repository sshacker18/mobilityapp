import React, { useState } from 'react'
import api from '../lib/api'
import { Field } from '../components/Field'
import Button from '../components/Button'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [stage, setStage] = useState<'name' | 'phone' | 'otp'>('name')
  const [loading, setLoading] = useState(false)
  const [returnedOtp, setReturnedOtp] = useState<string | null>(null)
  const { loginWithToken } = useAuth()

  const digitsOnly = phone.replace(/\D/g, '').slice(0, 10)
  const formattedPhone = `+91${digitsOnly}`

  async function requestOtp() {
    setLoading(true)
    try {
  const res = await api.post('/auth/request-otp', { phone: formattedPhone })
      setReturnedOtp(res.data.otp)
      setStage('otp')
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  async function verify() {
    setLoading(true)
    try {
  const res = await api.post('/auth/verify-otp', { phone: formattedPhone, code: otp })
      loginWithToken(res.data.token, res.data.user)
      window.location.href = '/home'
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell px-4 py-10">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-300">Mobility</span>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-300">Sign in to book rides across Hyderabad.</p>
        </div>

  <div className="auth-card sm:rounded-3xl sm:p-6 rounded-2xl p-4">
          <div className="mb-4 text-xs uppercase tracking-[0.25em] text-slate-300">Step {stage === 'name' ? '1' : stage === 'phone' ? '2' : '3'} of 3</div>

          {stage === 'name' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-200">Your name</label>
                <input
                  className="auth-input mt-2"
                  placeholder="e.g. Arjun Reddy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="name-input"
                />
              </div>
              <button
                type="button"
                className="primary-button"
                onClick={() => setStage('phone')}
                disabled={name.trim().length < 2}
                data-testid="continue-name"
              >
                Continue
              </button>
            </div>
          )}

          {stage === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-200">Phone number</label>
                <input
                  className="auth-input mt-2"
                  value={digitsOnly}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  name="phone"
                  data-testid="phone-input"
                  inputMode="numeric"
                  maxLength={10}
                />
                <div className="mt-2 text-xs text-slate-300">We’ll send OTP to {formattedPhone}</div>
              </div>
              <div className="flex gap-3">
                <button type="button" className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200" onClick={() => setStage('name')}>
                  Back
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={requestOtp}
                  disabled={loading || digitsOnly.length < 10}
                  data-testid="request-otp"
                >
                  Send OTP
                </button>
              </div>
            </div>
          )}

          {stage === 'otp' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200" data-testid="dev-otp">
                OTP sent to {formattedPhone} (dev: {returnedOtp})
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-200">Enter OTP</label>
                <input
                  className="auth-input mt-2 tracking-[0.35em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="••••"
                  name="otp"
                  data-testid="otp-input"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200" onClick={() => setStage('phone')}>
                  Change number
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={verify}
                  disabled={loading || otp.length < 4}
                  data-testid="submit-otp"
                >
                  Verify & Login
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-300">
          New here? <span className="text-brand">Create an account</span> · By continuing you agree to our terms.
        </div>
      </div>
    </div>
  )
}
