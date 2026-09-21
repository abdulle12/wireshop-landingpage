import { useState } from 'react'
import './App.css'
import LandingPage from './landingpage'
import { Analytics } from '@vercel/analytics/react';

function App() {
  

  return (
    <>
    <Analytics />

     <LandingPage/>
    </>
  )
}

export default App
