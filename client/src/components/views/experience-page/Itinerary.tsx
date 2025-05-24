import { ItinirariesProps } from '@/types/api.ds'
import React from 'react'

function Itinerary({data}:ItinirariesProps) {
  return (
    <div className='bg-[#8338EC] py-10 lg:py-20 bg-texture'>
        <div className='max-w-7xl mx-auto justify-center items-center'>

             <div className='flex items-center justify-center space-x-3 text-5xl uppercase text-[#c5e7c0]'>
                <h1>{data.name}</h1>
                <h1>Trips</h1>
             </div>

        </div>
    </div>
  )
}

export default Itinerary