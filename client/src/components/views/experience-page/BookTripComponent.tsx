import { Button } from '@/components/ui/button'
import { BaseDescriptionProps } from '@/types/api.ds'
import Link from 'next/link'
import React from 'react'

function BookTripComponent({data}:BaseDescriptionProps) {

  return (
    <div className='py-10 lg:py-20 bg-limeGreen bg-texture'>
        <div className='max-w-5xl space-y-5 mx-auto items-center justify-center'>
              <div className='flex items-center justify-center'>
                <h1 className='uppercase text-sm md:text-3xl text-electricPurple  lg:text-5xl'>{data?.name} group trips</h1>
              </div>

              <div>
                  <p className='text-center font-poppins'>{data?.short_description}</p>
              </div>

              <div className='flex items-center justify-center'>
                 <Link href={`/book-experience/${data?.slug}`}>
                   <Button className='px-5 py-3 bg-electricPurple text-[18px] uppercase'>Book now</Button>
                 </Link>
              </div>
        </div>
        
    </div>
  )
}

export default BookTripComponent