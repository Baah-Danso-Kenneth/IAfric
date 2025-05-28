'use client'

import Loader from '@/components/content/shared/Loader';
import Footer from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { useGetExperienceQuery } from '@/redux/features/all-experience/allExperieneApi'
import { ExperiencePageProps } from '@/types/regular.dt'
import React from 'react'
import HeroSection from './HeroSection';
import BaseDescription from './BaseDescription';
import Itinerary from './Itinerary';
import TourGuides from './TourGuides';
import Accomodation from './Accomodation';
import DestinationKindWord from './DestinationKindWord';
import WhatIncluded from './WhatIncluded';
import BookTripComponent from './BookTripComponent';
import MapandText from './MapandText';



function ExperiencePage({slug}: ExperiencePageProps) {
    const {data, isLoading} = useGetExperienceQuery(slug);

    if(isLoading) return <Loader/>

  return (
    <React.Fragment>
        <Header/>
            <HeroSection data={data}/>
            <BaseDescription data={data}/>
            <BookTripComponent data={data}/>
            <Itinerary data={data}/>
            <TourGuides data={data}/>
            <Accomodation data={data}/>
            <DestinationKindWord data={data}/>
            <WhatIncluded data={data}/>
            <MapandText data={data}/>
        <Footer/>
    </React.Fragment>
  )
}

export default ExperiencePage