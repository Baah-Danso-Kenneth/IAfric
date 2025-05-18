import { Button } from '@/components/ui/button'
import React from 'react'
import CurlyCard from '../cards/CurlyCard'
import { TeamMemberPros } from '@/types/regular.dt';
import { cn } from '@/lib/utils';

function AllInclusiveTeamDestination({country,btnText,members,className}:{country:string; btnText:string; members:TeamMemberPros[],className:string}) {
  return (
    <section className={cn('py-16 md:py-10 lg:py-20 space-y-5 md:space-y-6 lg:space-y-10',className)}>

        <div className='flex items-center justify-center'>
            <h1 className='text-center uppercase text-3xl md:text-4xl lg:text-5xl'>{country}</h1>
        </div>

        <div className='max-w-5xl mx-auto px-4 sm:px-6 '>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10 justify-items-center'>
                {members.map(({name,image,role},index)=>(
                    <CurlyCard key={index+1} name={name} image={image} role={role}/>

                ))}
            </div>
        </div>

        <div className='flex items-center justify-center'>
            <Button>{btnText}</Button>
        </div>
       
    </section>
  )
}

export default AllInclusiveTeamDestination