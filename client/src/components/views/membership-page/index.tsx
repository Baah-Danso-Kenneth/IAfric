import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import React from 'react'
import MembershipHeroSection from './MembershipHeroSection'
import FuelTravel from './FuelTravel'
import Perks from './Perks'
import LookForwardTo from './LookForwardTo'


function MemberShipPage() {
  return (
    <React.Fragment>
        <Header/>
          <MembershipHeroSection/>
          <FuelTravel/>
          <Perks/>
          <LookForwardTo/>
        <Footer/>
        </React.Fragment>
  )
}

export default MemberShipPage