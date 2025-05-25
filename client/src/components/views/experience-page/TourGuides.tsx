import { ItinirariesProps } from '@/types/api.ds'
import React from 'react'

function TourGuides({data}:ItinirariesProps) {
  return (
    <section className='bg-texture bg-[#c5e7c0] py-10  lg:py-20'>
   
        <div className='max-w-6xl mx-auto items-center justify-center'>
                <div className='flex items-center justify-center'>
                    <h1 className='text-sm lg:text-3xl uppercase' >Meet your trip leaders</h1>
                </div>

                <React.Fragment>
                    {data.location.map(({tour_guides},index)=>(
                        <div key={index+1}>
                            {tour_guides?.map(({id,bio,name},index)=>(
                                <div>
                                    <p>{name}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </React.Fragment>

        </div>
    </section>
  )
}

export default TourGuides