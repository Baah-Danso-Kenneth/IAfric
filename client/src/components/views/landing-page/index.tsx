import React from 'react'
import HeroSection from './HeroSection'
import Banner from './Banner'
import InfoSegement from './InfoSegement'
import DoubleSection from './DoubleSection'


export function LandingPage() {
  return (
    <React.Fragment>
        <Banner/>
        <InfoSegement/>
        <DoubleSection/>
        <HeroSection/>
        LandingPage
    </React.Fragment>
  )
}

