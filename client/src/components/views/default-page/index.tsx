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


export function DefaultPage() {
    return (
      <React.Fragment>
        <Header/>
        <HeroSection/>
        <LittleInfo/>
        <WhereWeGo/>
        <HelpYouDecide/>
        <PeopleTaught/>
        <ExtraInfo/>
        <OurWay/>
        <KindWords/>
        <SubScription/>
        <Footer/>
      </React.Fragment>
    )
  }
  
