import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

function BestPrice() {
  return (
    <div className='flex items-center justify-between mx-10 p-10'>
       <div className='w-[40%] space-y-10'>
        <h1 className='text-2xl lg:text-5xl text-nowrap lg:text-wrap font-play_flaire capitalize'>the best price for this destination</h1>
        <Button className='px-10 text-[20px]'>let&apos;s go</Button>
       </div>

       <div className='relative'>
       <Image src="/images/sunset.jpg" alt='' width={200} height={200} className=' hidden lg:block -left-20 top-3 absolute rounded-3xl'/>
          <Image src="/images/sunset.jpg" alt='' width={500} height={500} className='hidden lg:block object-contain lg:rounded-3xl'/>
          <Image src="/images/sunset.jpg" alt='' width={200} height={200} className='hidden lg:block absolute top-[50%] -left-20 rounded-3xl'/>

       </div>

    </div>
  )
}

export default BestPrice