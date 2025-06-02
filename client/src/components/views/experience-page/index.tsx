'use client'

import React from 'react'
import { Header } from '@/components/layout/Header';
import { ExperiencePageProps } from '@/types/regular.dt'
import ExperienceScreen from './ExperienceScreen';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/content/shared/Loader';


function ExperiencePage({ slug }: ExperiencePageProps) {
  if (!slug || typeof slug !== 'string') {
    return (
      <React.Fragment>
        <Header/>
          <Loader/>
        <Footer/>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Header/>
      <ExperienceScreen slug={slug}/>
      <Footer/>
    </React.Fragment>
  )
}

export default ExperiencePage