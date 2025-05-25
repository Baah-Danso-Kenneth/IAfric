import { ItinirariesProps } from '@/types/api.ds'
import Image from 'next/image'
import React from 'react'



function Itinerary({data}:ItinirariesProps) {
  return (
    <div className='bg-[#8338EC] py-10 lg:py-20 bg-texture'>
        <div className='max-w-7xl mx-auto justify-center items-center'>

             <div className='text-2xl md:text-3xl flex items-center mb-5 lg:mb-10 justify-center space-x-3 lg:text-5xl uppercase text-[#c5e7c0]'>
                <h1>{data?.name}</h1>
                <h1>Trips</h1>
             </div>


        <div className='space-y-16'>
          {data?.location.map((loc,index)=>(
            <div className="mx-10 grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl items-start lg:mx-auto">

                <div className='w-full h-[300px] lg:h-[400px]'>
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    width={500}
                    height={400}
                    className='w-full h-full object-cover'
                  />
                </div>

                <section>

                  <div className=' uppercase  text-sm text-nowrap  md:text-lg lg:text-2xl text-[#c5e7c0]  flex items-center gap-3 mb-3 lg:mb-5'>
                    <div >
                      <h1>day {index+1}</h1>
                    </div>

                      <div>
                        <h1>{loc?.name}</h1>
                      </div>
                  </div>
                   
                  <p className='text-sm font-poppins lg:text-[18px] text-white '>{loc?.description}</p>
                  <p className='text-[#c5e7c0] font-bowlby uppercase mt-2'>meals Included:{loc?.meal_included}</p>
                </section>

             </div>
          ))}

        </div>

        </div>
    </div>
  )
}

export default Itinerary