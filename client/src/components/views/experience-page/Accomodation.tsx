import { AccommodationProps } from '@/types/api.ds'
import React from 'react'
import Image from 'next/image'

function Accomodation({ data }: AccommodationProps) {
  return (
    <section className="py-10 lg:py-20 bg-electricPurple bg-texture">
      {/* Section Title */}
      <div className="flex items-center justify-center text-limeGreen uppercase text-2xl md:text-4xl lg:text-5xl font-semibold mb-10">
        <h1>Where to sleep</h1>
      </div>

      {/* Accommodation Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {data?.accommodations.map(({ id, name, location, description, image }) => (
          <div key={id} className="overflow-hidden  text-black">
            {/* Image */}
            <div className="w-full h-60 lg:h-80 relative">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-4 space-y-3 flex items-center justify-center flex-col">
              <h2 className="text-xl text-limeGreen uppercase lg:text-3xl">{name}</h2>
              <p className="text-sm uppercase text-center text-white lg:text-[18px]">{location}</p>
              <p className="text-sm text-white text-center lg:text-[18px]">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Accomodation
