import { outTro } from '@/lib/data'
import { AllExperienceProps, LocationProps } from '@/types/regular'
import Link from 'next/link'
import React from 'react'

function Location({place_name, description,
   duration_days,duration_nights}:LocationProps){
  return (
    <div className='py-20'>
        <div className='flex flex-col items-center space-y-3'>
            <h1 className='text-5xl uppercase font-play_flaire'>explore ghana X {place_name}</h1>
            <p className='text-[15px] font-bowlby'>{duration_days} days | {duration_nights} nights</p>
        </div>

        <div className=' flex items-center justify-center mt-5'>
            <p className='w-[70%] text-[20px] text-start'>{description}</p>
        </div>

        <div className="py-10 flex items-center justify-center space-x-2 text-lg">
  {outTro.map(({ name, query }, index) => (
    <React.Fragment key={index}>
      <Link href={query} className="underline text-[20px] uppercase">
        {name}
      </Link>
      {index !== outTro.length - 1 && <span className="mx-2">|</span>}
    </React.Fragment>
  ))}
</div>


    </div>
  )
}

export default Location