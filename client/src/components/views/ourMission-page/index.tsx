import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import React from 'react'
import Banner from '../landing-page/Banner'
import LittleDescription from './LittleDescription'
import Routine from '../default-page/Routine'
import InfoSegement from '../landing-page/InfoSegement'
import ExtraInfo from '../default-page/ExtraInfo'

function OurMission() {
  return (
    <React.Fragment>
        <Header/>
        <Banner/>
        <LittleDescription/>
        <Routine/>
        <InfoSegement/>
        <ExtraInfo/>
     
        <Footer/>
    </React.Fragment>
  )
}

export default OurMission