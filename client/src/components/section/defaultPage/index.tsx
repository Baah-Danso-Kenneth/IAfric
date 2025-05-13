import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import React from 'react'
import HeroSection from './heroSection'
import BaseContent from './baseContent'
import Unmatched from './unmatched'
import Discover from './discover'
import VisitGhana from './visitGhana'
import BestPrice from './bestPrice'

function DefaultPage() {
  return (
    <div>
       <HeroSection/>
       <BaseContent/>
       <Unmatched/>
       <Discover/>
       {/* <VisitGhana/> */}
       <BestPrice/>
    </div>
  )
}

export default DefaultPage