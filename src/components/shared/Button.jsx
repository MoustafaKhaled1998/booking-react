import React from 'react'
import './Button.css'

export const PrimaryButton = ({ children, className = '', ...props }) => (
  <button
    className={`primary-btn rounded-full px-4 py-2 font-semibold transition ${className}`}
    {...props}
  >
    {children}
  </button>
)

export const SecondaryButton = ({ children, className = '', ...props }) => (
  <button
    className={`secondary-btn rounded-full px-4 py-2 font-semibold transition ${className}`}
    {...props}
  >
    {children}
  </button>
)