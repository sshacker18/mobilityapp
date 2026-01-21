import React from 'react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface PhoneStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
}

export default function PhoneStep({ value, onChange, onNext }: PhoneStepProps) {
  const isValid = value ? isValidPhoneNumber(value) && value.startsWith('+91') : false

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Let’s get you moving</h2>
        <p className="text-sm text-slate-300">Enter your phone number to receive a quick OTP.</p>
      </div>
      <div className="space-y-3">
        <label className="wizard-label-dark" htmlFor="phone-input">Phone number</label>
        <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-soft">
          <PhoneInput
            id="phone-input"
            defaultCountry="IN"
            countries={['IN']}
            international={false}
            countryCallingCodeEditable={false}
            value={value}
            onChange={(val) => onChange(val || '')}
            className="phone-input"
          />
        </div>
        {!isValid && value && (
          <p className="text-xs text-rose-300">Please enter a valid +91 number.</p>
        )}
      </div>
      <button
        type="button"
        className="wizard-button"
        disabled={!isValid}
        onClick={onNext}
      >
        Send OTP
      </button>
    </div>
  )
}
