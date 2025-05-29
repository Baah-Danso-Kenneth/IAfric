'use client'

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
import { useGetExperienceQuery } from '@/redux/features/all-experience/allExperieneApi'
import Loader from '@/components/content/shared/Loader';
import { ExperiencePageProps } from '@/types/regular.dt';


function ExperienceScreen({slug}: ExperiencePageProps) {
     const {data, isLoading} = useGetExperienceQuery(slug);
    
     if(isLoading) return <Loader/>
    
  return (
    <React.Fragment>
            <HeroSection data={data}/>
            <BaseDescription data={data}/>
            <BookTripComponent data={data}/>
            <Itinerary data={data}/>
            <TourGuides data={data}/>
            <Accomodation data={data}/>
            <DestinationKindWord data={data}/>
            <WhatIncluded data={data}/>
            <MapandText data={data}/>
    </React.Fragment>
  )
}

export default ExperienceScreen