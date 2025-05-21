import {Header} from '@/components/layout/Header'
import {HeroSection} from '@/components/views/default-page/HeroSection'
import {LittleInfo} from '@/components/views/default-page/LittleInfo'
import {WhereWeGo} from './WhereWeGo'
import {HelpYouDecide} from './HelpYouDecide'
import PeopleTaught from './PeopleTaught'
import SubScription from '@/components/content/common/SubScription'
import Footer from '@/components/layout/Footer'
import React from 'react'
import KindWords from './KindWords'
import ExtraInfo from './ExtraInfo'
import OurWay from './OurWay'
import Sponsors from './Sponsors'
import Routine from './Routine'
import DoubleSection from '../landing-page/DoubleSection'
import InfoSegement from '../landing-page/InfoSegement'
import VacationEssentials from '../landing-page/VacationEssentials'
import SectionElapse from '../landing-page/HeroSection'
import CarouselWithText from '../landing-page/CarouselWithText'


export function DefaultPage() {
    return (
      <React.Fragment>
        <CarouselWithText/>
        <Header/>
        <HeroSection/>
        <LittleInfo/>
        <WhereWeGo/>
        <DoubleSection/>
       <VacationEssentials/>
        <SectionElapse/>
        <HelpYouDecide/>
        <PeopleTaught/>
        {/* <Routine/> */}
        <OurWay/>
        <KindWords/>
        <SubScription className="bg-[#8338EC]"/>
        <Sponsors/>
        <Footer/>
      </React.Fragment>
    )
  }
  
