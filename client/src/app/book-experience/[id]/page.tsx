'use client'

import React from 'react'
import BookExperience from '@/components/views/book-experience-page'
import { useParams } from 'next/navigation'
import { useGetExperienceQuery } from '@/redux/features/all-experience/allExperieneApi'
import Loader from '@/components/content/shared/Loader'



function Page() {
    const params = useParams();
    const {data:experienceData, error, isLoading} = useGetExperienceQuery(params.id as string)

    if(isLoading){
        return <Loader/>
    }   

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>Failed to load experience data</p>
        </div>
      </div>
    )
  }
 if (!experienceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Experience not found</p>
      </div>
    )
  }



  return <BookExperience data={experienceData}/>
}

export default Page