import CurlyCard from '@/components/content/cards/CurlyCard'
import { teamMembersData } from '@/lib/data'
import React from 'react'

function TeamRole() {
  return (
    <section className='py-16 md:py-20 lg:py-24 bg-[#8338EC]'>
        
        <div className='container  mx-auto px-4 sm:px-6'>

                <div className='text-center mb-12 md:mb-16'>
                    <h2 className='text-3xl sm:text-4xl md:text-5xl uppercase text-[#c5e7c0]'><span className='relative z-10'>meet the able team</span></h2>
                </div>

                <div className='max-w-5xl mx-auto px-4 sm:px-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 justify-items-center'>
                         {teamMembersData.map(({name,image,role},index)=>(
                          <div className='w-full flex justify-center'>
                            <CurlyCard
                            key={index+1}
                            name={name}
                            image={image}
                            role={role}
                            />
                          </div>
                         ))}
                      </div>
                </div>

        </div>

    </section>
  )
}

export default TeamRole