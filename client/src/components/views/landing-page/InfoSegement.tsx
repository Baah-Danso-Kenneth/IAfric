import NewSeasonDestinationCard from '@/components/content/cards/NewSeasonDestinationCard'
import { newDestinationData } from '@/lib/data'
import Link from 'next/link'
import React from 'react'

function InfoSegement() {
  return (
    <div className='py-16 md:py-20 bg-[#8338EC] text-white'>
        <div className='text-center space-y-5 '>
            <h1 className='text-3xl font-bowlby md:text-5xl'>Lorem ipsum dolor sit, amet</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, iure.</p>

                    <div className='flex items-center justify-center flex-col'>
                        <Link href="/welcome" className="relative text-[20px] bg-transparent hover:bg-transparent ">
                            <span className="relative z-10 text-white">Let&apos;s go</span>
                            </Link>
                        <div className='bg-white h-1 w-10'/>
                     </div>
            
        </div>

        <div className='pt-10 max-w-[95%] mx-auto px-4 sm:px-6 '>
                <div className='text-center mb-5'>
                    <h1 className='text-3xl font-bowlby'>2025 travelling destination</h1>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 justify-center'>
                    {newDestinationData.map(({description,image,price},index)=>(
                        <div className='w-full flex justify-center' key={index+1}>
                            <NewSeasonDestinationCard
                                
                                image={image}
                                description={description}
                                price={price}
                            />

                        </div>
                    ))}
                </div>

        </div>

    </div>
  )
}

export default InfoSegement