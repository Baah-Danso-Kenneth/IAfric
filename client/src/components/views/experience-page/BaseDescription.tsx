import { directionLinks, retro } from '@/lib/data'
import { BaseDescriptionProps } from '@/types/api.ds'
import Link from 'next/link'
import React from 'react'

function BaseDescription({data}:BaseDescriptionProps) {
  return (
    <div className='bg-white bg-texture'>
    <div className=' max-w-7xl mx-auto py-10 lg:py-20 bg-cover space-y-3 lg:space-y-10'>
            <div className='flex items-center justify-center'>
                <h1 className='text-[20px] text-wrap md:text-4xl lg:text-6xl uppercase text-[#8338EC] font-outfit'>litrafric X {data?.name}</h1>
            </div>

             <div className='text-zinc-800  flex text-sm md:text-[20px] items-center justify-center space-x-3 uppercase lg:text-2xl'>
                <div>
                    <h1><span className='mr-2'>{data?.duration_days}</span>days</h1>
                </div>
                <div>|</div>
                <div>
                    <h1><span className='mr-2'>{data?.duration_nights}</span>nights</h1>
                </div>
             </div>

            <div>
                <p className='p-3 lg:p-0 text-sm md:text-lg lg:text-[20px] text-zinc-800'>{data?.description}</p>
            </div>

            <div className='flex items-center justify-center flex-wrap'>
            {directionLinks.map((items,index)=>(
              <div  key={index+1}>
              <Link href={items.path}>
                <span className=' text-[15px] lg:text-[20px] uppercase underline text-[#8338EC]'>{items.name}</span>
              </Link>
               {index < directionLinks.length -1 && (
                <span className='mx-3 text-gray-500 '>|</span>
               )}
              </div>
            ))}
          </div>

        </div>

        </div>
  )
}

export default BaseDescription