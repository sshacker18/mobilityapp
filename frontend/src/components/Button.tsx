import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<Props> = ({ size = 'lg', children, className = '', ...rest }) => {
  const sizeCls = size === 'lg' ? 'py-3 px-4 text-lg' : size === 'md' ? 'py-2 px-3' : 'py-1 px-2 text-sm'
  return (
    <button
      {...rest}
      className={`bg-primary text-white rounded-md ${sizeCls} w-full disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
