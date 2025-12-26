import React from 'react'

const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  className = '' 
}) => {
  if (!message) return null
  
  const typeClasses = {
    success: 'alert-success',
    error: 'alert-error',
    warning: 'alert-warning',
    info: 'alert-info'
  }
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  
  return (
    <div className={`alert ${typeClasses[type]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2">{icons[type]}</span>
          <span>{message}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export default Alert