import React from 'react'
import dynamic from 'next/dynamic'

const Header = dynamic(()=>import(/*webpackChunkName: "header"*/ "../components/menu/Header"))
const Footer = dynamic(()=>import(/*webpackChunkName: "footer"*/ "../components/footer/Footer"))
export default function MainLayout({children}) {
  return (
    <>
    <main className="min-h-[81vh]">
        <Header />
        <div>
            {children}
        </div>
    </main>
    
    <Footer />
    </>
  )
}
