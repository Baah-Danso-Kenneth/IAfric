import Inscription from '@/components/content/shared/Inscription'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function VacationEssentials() {
  return (
    <section className='bg-[#c5e7c0] py-16 md:py-20 w-full'>
        <Inscription/>

      <div className='max-w-7xl mx-auto grid grid-cols-1 gap-10 lg:grid-cols-2'>
        {/* Image Section - Shows first on mobile */}
        <div className='order-1 lg:order-2 relative w-full px-5 md:px-10 lg:px-0 lg:pr-10'>
          {/* Main background image */}
          <div className='relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh]  overflow-hidden'>
            <Image 
              alt="Vacation background" 
              src="/images/clique.jpg" 
              fill 
              className='object-cover'
            />
            
            {/* Overlaid images - positioned absolute over the background */}
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 z-10'>
              {/* First overlaid image - taller */}
              <div className='absolute top-0 -left-[5%] w-[60%] h-full  overflow-hidden '>
                <Image 
                  alt="Vacation highlight 1" 
                  src="/images/cantropae.jpg" 
                  fill 
                  className='object-cover'
                />
              </div>
              
              {/* Second overlaid image - shorter */}
              <div className='absolute bottom-0 -right-[5%] w-2/5 h-[30vh] lg:h-[50vh]  overflow-hidden shadow-lg'>
                <Image 
                  alt="Vacation highlight 2" 
                  src="/images/cubes.jpeg" 
                  fill 
                  className='object-cover'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Section - Shows second on mobile */}
        <div className='order-2 lg:order-1 flex items-center'>
          <div className='max-w-xl mx-auto lg:mx-0 px-6 md:px-8 lg:pl-20 lg:pr-0'>
            <div className='space-y-6'>
              <h3 className='text-lg font-medium text-amber-700 uppercase tracking-wider'>summer</h3>
              <h2 className='text-3xl md:text-4xl lg:text-5xl font-bowlby leading-tight'>vacation Essentials</h2>
              <p className='text-gray-700 md:text-lg'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit nesciunt deserunt laborum, fuga atque ipsa?
              </p>

              <div className='flex flex-col sm:flex-row gap-6 pt-4'>
                <div className='group'>
                  <Link href="/welcome" className="relative inline-block text-lg font-medium">
                    <span className="relative z-10 text-black">Let&apos;s go</span>
                  </Link>
                  <div className='h-1 w-0 bg-black transition-all duration-300 group-hover:w-full'/>
                </div>

                <div className='group'>
                  <Link href="/welcome" className="relative inline-block text-lg font-medium">
                    <span className="relative z-10 text-black">View Collection</span>
                  </Link>
                  <div className='h-1 w-0 bg-black transition-all duration-300 group-hover:w-full'/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VacationEssentials