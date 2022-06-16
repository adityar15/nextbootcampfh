import React from 'react'

export default function ColoredLayer({children, color}) {
  return (
    <div className={`w-full min-h-[81vh] ${color}`}>
        {children}
    </div>
  )
}
