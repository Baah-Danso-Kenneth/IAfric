import Image from 'next/image'
import React from 'react'

function HeroSection() {
  return (
    <div className='relative w-full h-screen'>
        <Image
          src="/images/clique.jpg"
          alt="Meet clique background"
          fill
          priority
          className='object-cover'
        />
         <div className="absolute inset-0 bg-black/30" />


        <div className='absolute inset-x-0 top-0 flex justify-center'>
            <div className='text-center mt-10 md:mt-16  px-4 md:px-8 lg:mt-20'>
                <h1 className='text-3xl text-wrap md:text-5xl font-delight_mother capitalize lg:text-6xl lg:text-nowrap text-white '>we take you across africa in a grand style</h1>
            </div>
        </div>

    </div>
  )
}

export default HeroSection