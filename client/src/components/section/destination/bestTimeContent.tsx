import { useMapContent } from '@/hooks/useMapContent'
import { BestTimeProps, MapContentTypes } from '@/types/regular'
import Image from 'next/image'
import React from 'react'

function BestTimeContent({region_map,best_time_title, best_time_des, weather_time_title, weather_time_des}:BestTimeProps) {
  const {mapcontents} = useMapContent();
  
  return (
    <div className='flex items-start justify-center mx-auto max-w-5xl gap-20 py-10'>
        <div className='w-[50%]'>
            <Image 
              src={region_map} 
              className=' h-[400px] object-contain' 
              alt="" 
              width={500} 
              height={500}
            />
        </div>

        <div className='w-[50%] space-y-10'>
            <div>
                <h1 className='text-[20px] font-play_flaire font-bold uppercase mb-3'>
                  {best_time_title}
                </h1>
                <p className='text-[18px] text-zinc-800 font-light'>
                  {best_time_des}
                </p>
            </div>

            <div>
              <h1 className='text-[20px] font-play_flaire font-bold uppercase mb-3'>
                {weather_time_title}
              </h1>
              <p className='text-[18px] text-zinc-800 font-light'>
                {weather_time_des}
              </p>
            </div>
        </div>
    </div>
  )
}

export default BestTimeContent