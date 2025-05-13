'use client'

import React from 'react'
import ItenaryCard from './itenaryCard'
import { useItiniraries } from '@/hooks/useItinirary'

function TenaryHolder({place_name,experienceId}:{place_name:string,experienceId:number}) {
    const {itineraries} = useItiniraries();

    const filteredItenaries = itineraries.filter(
        (rec)=>rec.experience.id === experienceId
    )
  return (
    <div className='py-10'>
        <div className='flex items-center justify-center py-10'>
            <h1 className='font-play_flaire text-center text-5xl uppercase'>{place_name} itenary</h1>
        </div>

<div className='flex items-center flex-col justify-center mx-20'>

{filteredItenaries.length > 0 ? (
  filteredItenaries.map((rec, index) => (
    <ItenaryCard 
          key={index}
          image={rec.image}
          day_number={index + 1}
          title={rec.title}
          description={rec.description}
          meal_included={rec.meal_included}
          meal_description={rec.meal_description}
           experience={rec.experience}           />
  ))
) : (
  <div>no data</div>
)}

        </div>

            <div className='mx-20 flex justify-center items-center'>
                <p className='text-sm text-center'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta quo hic suscipit quos aliquam illum dolorem sapiente nemo dignissimos quas ?</p>
            </div>
    </div>
  )
}

export default TenaryHolder