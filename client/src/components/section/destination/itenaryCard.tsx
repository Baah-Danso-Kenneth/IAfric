import { ItenaryTypes, ItineraryProps } from '@/types/regular'
import Image from 'next/image'
import React from 'react'

function ItenaryCard({ image,  description,  meal_description, meal_included,title, day_number }: ItineraryProps) {
  return (
    <div className="flex items-center gap-20 mb-10">
      <div className="flex-1 relative w-[550px] h-[500px]">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            className="object-cover" 
          />
        )}
      </div>
      <div className="flex-1 place-self-start">
        <h1 className="uppercase text-[25px] font-bowlby">
          day {day_number}: <span className="font-dmMono">{title}</span>
        </h1>
        <p className="text-[20px]">{description}</p>

        <div className="py-5">
          <h1>
            Meals included: <span>{meal_included ? meal_description : "Not included"}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ItenaryCard;
