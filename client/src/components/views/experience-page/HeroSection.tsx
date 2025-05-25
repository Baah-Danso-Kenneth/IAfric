import { LocationHeroSection } from '@/types/api.ds'
import Image from 'next/image'
import React from 'react'

function HeroSection({ data }:  LocationHeroSection ) {
  return (
    <div className="relative w-full h-[50vh]">
      {data?.main_image ? (
              <Image
              src={data.main_image}
              alt={data?.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
      ):null}


    
      <div className="absolute inset-0 bg-black/20 z-10" />


      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <h1 className="text-white font-poppins text-wrap font-extralight  uppercase text-3xl md:text-5xl lg:text-8xl  text-center px-4">
          {data?.name}
        </h1>
      </div>
    </div>
  )
}

export default HeroSection
