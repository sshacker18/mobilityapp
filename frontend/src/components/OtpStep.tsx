import React, { useEffect, useMemo, useRef, useState } from 'react'

interface OtpStepProps {
  length?: number
  onVerify: (code: string) => Promise<boolean>
  onResend: () => void
  cooldown: number
  helperText?: string
}

export default function OtpStep({ length = 4, onVerify, onResend, cooldown, helperText }: OtpStepProps) {
  const [values, setValues] = useState<string[]>(Array.from({ length }, () => ''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  const code = useMemo(() => values.join(''), [values])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (code.length === length && values.every((digit) => digit.length === 1)) {
      void handleVerify(code)
    }
  }, [code, length, values])

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return
    setError('')
    const next = [...values]
    next[index] = value
    setValues(next)
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = Array.from({ length }, (_, i) => pasted[i] || '')
    setValues(next)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  const handleVerify = async (otp: string) => {
    setIsVerifying(true)
    const ok = await onVerify(otp)
    setIsVerifying(false)
    if (!ok) {
      setError('That code didn’t work. Please try again.')
      setValues(Array.from({ length }, () => ''))
      inputsRef.current[0]?.focus()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Enter the OTP</h2>
        <p className="text-sm text-slate-300">We sent a code to your phone. {helperText}</p>
      </div>
      <div className="flex gap-3">
        {values.map((value, index) => (
          <input
            key={`otp-${index}`}
            ref={(el) => (inputsRef.current[index] = el)}
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="h-14 w-12 rounded-2xl border border-white/10 bg-white/10 text-center text-xl font-semibold text-white shadow-soft focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      <div aria-live="polite" className="text-sm text-rose-300">
        {error}
      </div>
      <div className="flex items-center justify-between text-sm text-slate-300">
        <button
          type="button"
          className="text-brand hover:text-brand-dark disabled:text-slate-300"
          disabled={cooldown > 0}
          onClick={onResend}
        >
          Resend code {cooldown > 0 && `(${cooldown}s)`}
        </button>
        {isVerifying && <span className="text-xs text-slate-400">Verifying…</span>}
      </div>
    </div>
  )
}
