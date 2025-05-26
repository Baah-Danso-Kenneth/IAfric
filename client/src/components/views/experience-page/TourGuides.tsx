import { ItinirariesProps } from '@/types/api.ds'
import Image from 'next/image'
import React from 'react'

function TourGuides({ data }: ItinirariesProps) {

  const allGuides = data?.location.flatMap((loc) =>
    loc.tour_guides?.map((guide) => ({
      ...guide,
      locationName: loc.name
    })) || []
  );

  return (
    <section className="bg-texture bg-[#c5e7c0] py-10 lg:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-xl md:text-2xl text-[#8338EC] lg:text-4xl  uppercase tracking-wide">
            Meet your trip leaders
          </h1>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {allGuides?.map(({ id, name, image, locationName },index) => (
            <div
              key={index+1}
              className="flex flex-col items-center text-center space-y-2 bg-white rounded-xl shadow-lg p-4"
            >
          
              <div className="w-32 h-32 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-white shadow-md">
                <Image
                  src={image}
                  alt={name}
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Name */}
              <p className="text-base font-semibold  text-gray-800">{name}</p>

            
              <p className="text-sm text-gray-500">{locationName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TourGuides
