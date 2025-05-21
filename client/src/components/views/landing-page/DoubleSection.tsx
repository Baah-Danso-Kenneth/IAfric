import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DoubleSection() {
  return (
    <div className='relative h-screen w-full '>
      <div className='grid grid-cols-1 lg:grid-cols-2 h-full w-full'>

        <div className='relative w-full'>
          <Image
           src="/images/hero-img.jpg"
           alt="Divide section"
           fill
           priority
           className='object-cover'
          />

    <div className='absolute inset-x-0 top-0 flex flex-col justify-start space-y-5'>
                <div className="text-start px-4 md:px-8 mt-16 ">
                    <h1 className='text-2xl md:text-3xl lg:text-4xl text-white font-bowlby uppercase '>group trip</h1>
                </div>


                <div className='flex items-start justify-start flex-col px-4 md:px-8'>
                        <Link href="/welcome" className="relative text-sm lg:text-[20px] bg-transparent hover:bg-transparent ">
                            <span className="relative z-10 text-white">Let&apos;s go</span>
                            </Link>
                        <div className='bg-white w-10 h-[0.5px] lg:h-1 lg:w-18'/>
                     </div>
            </div> 

        </div>

        <div className='relative w-full'>
          <Image
           src="/images/clique.jpg"
           alt="Divide section"
           fill
           priority
           className='object-cover'
          />

      <div className='absolute inset-x-0 top-0 flex flex-col justify-start space-y-5'>
                <div className="text-start px-4 md:px-8 mt-16 ">
                    <h1 className='text-2xl md:text-3xl lg:text-4xl text-white font-bowlby uppercase'>Customize trip</h1>
                </div>

                <div className='flex items-start justify-start flex-col px-4 md:px-8'>
                        <Link href="/welcome" className="relative text-sm lg:text-[20px] bg-transparent hover:bg-transparent ">
                            <span className="relative z-10 text-white">Let&apos;s go</span>
                            </Link>
                        <div className='bg-white w-10 h-[0.5px] lg:h-1 lg:w-18'/>
                     </div>
            </div> 

        </div>

      </div>
 
    </div>
  )
}

export default DoubleSection