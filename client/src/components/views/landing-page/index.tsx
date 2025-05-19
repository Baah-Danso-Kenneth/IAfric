import React from 'react'
import HeroSection from './HeroSection'
import Banner from './Banner'
import InfoSegement from './InfoSegement'
import DoubleSection from './DoubleSection'
import VacationEssentials from './VacationEssentials'
import Footer from '@/components/layout/Footer'
import SomeHeader from './SomeHeader'
import CarouselWithText from './CarouselWithText'
import TrendingTourDropDown from '@/components/content/dropDowns/TrendingTourDropDown'


export function LandingPage() {
  return (
    <React.Fragment>
      <CarouselWithText/>
      <SomeHeader/>
        <Banner/>
        <InfoSegement/>
        <DoubleSection/>
        <VacationEssentials/>
        <HeroSection/>
        <Footer/>
        {/* <TrendingTourDropDown/> */}
    </React.Fragment>
  )
}

