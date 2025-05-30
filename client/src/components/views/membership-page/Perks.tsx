import { Button } from '@/components/ui/button'
import { perksList } from '@/lib/data'
import Image from 'next/image'
import React from 'react'

function Perks() {

  return (
    <div className='bg-texture bg-electricPurple py-10 lg:py-20'>
      <div className='max-w-7xl mx-auto px-5 lg:px-8'>
        <div className='space-y-5 lg:space-y-10'>
    
          <div>
            <h1 className='text-3xl md:text-4xl lg:text-6xl uppercase text-limeGreen'>
              let&apos;s talk perks
            </h1>
          </div>

          {/* Grid with items-start to align both sections at the top */}
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 items-start'>
 
            {/* Image Section - aligned to start from top */}
            <div className='relative w-full h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden'>
              <Image 
                src="/images/afr.png" 
                alt="perks"
                fill 
                priority
                className='object-cover'
              />
            </div>

            {/* Text Content Section - also starts from top */}
            <div className='space-y-6 lg:space-y-8'>
              
              {/* Membership Title */}
              <div className='text-center xl:text-left'>
                <h2 className='text-sm w-full lg:w-[40%] md:text-[18px] lg:text-[20px] uppercase text-limeGreen font-bold'>
                  Annual Membership 50000 sats/year
                </h2>
              </div>

              {/* Perks List */}
              <div className='space-y-4'>
                {perksList.map((perk, index) => (
                  <div key={index} className='flex items-start space-x-3 text-white'>
                    <div className='flex-shrink-0 w-2 h-2 bg-limeGreen rounded-full mt-2'></div>
                    <div className='flex-1'>
                      <span className='text-base md:text-lg leading-relaxed'>
                        {perk.text}
                        {perk.value && (
                          <span className='text-limeGreen font-medium ml-2'>
                            ({perk.value})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className='pt-6 text-center xl:text-left'>
                <Button className='bg-limeGreen hover:bg-limeGreen/90 text-electricPurple px-8 py-4 lg:py-6 text-lg uppercase font-bold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg'>
                  OMG Sign Me Up
                </Button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Perks