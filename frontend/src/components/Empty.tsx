import React from 'react'

export const Empty: React.FC<{ title?: string; message?: string; action?: React.ReactNode }> = ({
  title = 'Nothing here',
  message = '',
  action = null,
}) => {
  return (
    <div className="p-6 text-center">
      <div className="text-xl font-semibold mb-2">{title}</div>
      {message && <div className="text-sm text-gray-600 mb-4">{message}</div>}
      {action}
    </div>
  )
}

export default Empty
