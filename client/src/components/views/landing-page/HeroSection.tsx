import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function SectionElapse() {
  return (
    <div className='relative w-full h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-2 h-full w-full'>
        <div className='relative w-full h-full'>
          <Image
            src="/images/hero-img.jpg"
            alt="Hero background"
            fill
            priority
            className='object-cover'
          />
        </div>
        <div className='hidden  relative w-full h-full lg:flex items-center justify-center'>
          <Image
            src="/images/clique.jpg"
            alt="Hero background"
            fill
            priority
            className='object-cover'
          />
          
          {/* Centered image with border */}
          <div className='relative z-10 p-8'>
            <div className='border-10 border-black '>
              <div className='relative w-[500px] h-[500px]'>
                <Image
                  src="/images/cantropae.jpg"
                  alt="Centered image"
                  fill
                  className='object-cover'
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute inset-0 bg-black/30" />

      <div className='absolute inset-x-0 top-[10%] flex  justify-center z-50'>
                <div className="max-w-4xl text-center px-4 md:px-8 mt-16 space-y-5">
                    <h1 className='text-3xl md:text-5xl lg:text-6xl text-white font-bowlby'>New sights, same soul.</h1>
                    <p className='text-sm md:text-[20px] text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis ab ex iste odio, quaerat eius id. Amet laboriosam atque voluptatum.</p>

                    <div className='flex items-center justify-center flex-col'>
                    <Link href="/welcome" className="relative text-[20px] bg-transparent hover:bg-transparent ">
                        <span className="relative z-10 text-white">Let&apos;s go</span>
                    </Link>
                    <div className='bg-white h-1 w-10'/>
                    </div>

                </div>
            </div> 

    </div>
  )
}

export default SectionElapse