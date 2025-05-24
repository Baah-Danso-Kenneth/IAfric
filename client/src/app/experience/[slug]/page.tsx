import ExperiencePage from '@/components/views/experience-page'
import { PageProps } from '@/types/regular.dt';
import React from 'react'



export async function generateMetadata({params}:PageProps){
  const country = params.slug;

  return {
    title: `${country.charAt(0).toUpperCase() + country.slice(1)}`,
    description: `Exlore excititing experiene in ${country}`
  }
}

export default function Experience({params}:PageProps) {
  return <ExperiencePage slug={params.slug}/>
}

