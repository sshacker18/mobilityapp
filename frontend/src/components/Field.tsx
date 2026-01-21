import React from 'react'

interface Props {
  label: string
  value?: string
  onChange?: (v: string) => void
  type?: string
  placeholder?: string
  name?: string
  dataTestId?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
}

export const Field: React.FC<Props> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  name,
  dataTestId,
  inputMode,
  maxLength
}) => {
  return (
    <label className="block mb-3">
      <div className="text-sm font-medium mb-1">{label}</div>
      <input
        className="w-full border rounded-md px-3 py-2"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        name={name}
        data-testid={dataTestId}
        inputMode={inputMode}
        maxLength={maxLength}
      />
    </label>
  )
}

export default Field
