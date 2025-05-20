import React from 'react'
import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import HeroSection from './HeroSection'
import TeamRole from './TeamRole'
import Description from './Description'
import Subscription from '@/components/content/common/SubScription'
import VariousTrips from './VariousTrips'

function MeetClique() {
  return (
    <React.Fragment>
      <Header/>
      <HeroSection/>
      <TeamRole/>
      <Description/>
      <VariousTrips/>
      <Subscription/>
      <Footer />
      </React.Fragment>
  )
}

export default MeetClique