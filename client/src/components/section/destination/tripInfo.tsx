import { tripInfoTypes } from '@/lib/data'
import React from 'react'
import TripInfoCard from './tripInfoCard'

function TripInfo({location}:{location:string | null}) {
  return (
    <div className="w-full flex flex-col items-center px-5">
     
      <div className='flex flex-col items-center space-y-5 max-w-4xl text-center'>
        <h1 className='text-5xl font-play_flaire uppercase'>{location} trip</h1>
        <p className='text-[20px]'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam nisi iure facilis consequatur error 
          dolor hic necessitatibus vitae vero quas deserunt sunt rem, sint blanditiis optio culpa voluptatem magni! Accusamus.
        </p>
      </div>
 
        <div className="flex items-center justify-center gap-10 py-10">
          {tripInfoTypes.map(({ rooms, date, image, location, soldOut }, index) => (
            <TripInfoCard
              key={index}
              image={image}
              location={location}
              date={date}
              rooms={rooms}
              soldOut={soldOut}
            />
          ))}
        </div>
      </div>
    
  )
}

export default TripInfo
