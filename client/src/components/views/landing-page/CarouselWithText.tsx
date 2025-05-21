import TextCarousel from '@/components/content/shared/TextCarousel'
import { carouselData, joinData } from '@/lib/data'
import React from 'react'

function CarouselWithText() {
  return (
    <section className='border border-b-2 border-l-0 border-r-0 border-t-0 p-3'>
        <div className='max-w-7xl mx-auto flex items-center justify-center  lg:justify-between'>
            <div></div>
            <div>
                <TextCarousel carousels={carouselData}/>
            </div>

            <div className='hidden lg:flex items-center  gap-5'>
              {joinData.map(({icon:Icon,name},index)=>(
                <div key={index+1} className='flex items-center gap-2 uppercase '>
                  <Icon className="w-4 h-4"/>
                  <span className='text-gray-500 font-play_flaire text-sm'>{name}</span>
                </div>
              ))}
              </div>
        </div>
      
        </section>
  )
}

export default CarouselWithText