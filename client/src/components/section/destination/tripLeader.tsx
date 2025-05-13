import { Button } from '@/components/ui/button';
import { Guide, TripInfoTypes } from '@/types/regular';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function TripLeader({image,name,id}: Guide){
    const defaultImage='/images/default-guide-image.png'

  return (
    <div className='flex flex-col items-center justify-center space-y-10 py-10'>
         <div>
            <h1 className='text-5xl uppercase font-play_flaire'>meet your trip leader</h1>
         </div>

         <div className='w-[350px] h-[350px] rounded-full'>
            <Image src={image ?image: defaultImage} width={500}  alt="guide" className='w-[350px] h-[350px] rounded-full object-cover' height={500}/>
         </div>

        <Link href={`/tour_guide/${id}`}>
         <Button className='capitalize px-10 py-5 text-[15px]'>
          meet {" "}{name}
        </Button>
        </Link>
    </div>
  )
}

export default TripLeader