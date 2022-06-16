import React from 'react'

export default function Hamburger({clicked}) {
  return (
    <button className="outline-none focus:outline-none border-none flex flex-col space-y-2 mr-7 md:hidden" onClick={clicked}>
        <div className="h-2 w-12 bg-gray-50"></div>
        <div className="h-2 w-12 bg-gray-50"></div>
        <div className="h-2 w-12 bg-gray-50"></div>
    </button>
  )
}
