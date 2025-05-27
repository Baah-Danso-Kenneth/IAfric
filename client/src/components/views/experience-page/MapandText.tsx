import { BlendMapTypes } from '@/types/api.ds'
import Image from 'next/image'
import React from 'react'

function MapandText({ data }: BlendMapTypes) {
  const content = data?.map_details;

  return (
    <section className="py-14 lg:py-24 bg-limeGreen bg-texture">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Map Image */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="relative w-full h-80 md:h-[400px]">
              <Image
                src={content.region_map}
                alt={content.weather_title}
                layout="fill"
                objectFit="contain"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center lg:text-left space-y-10">
            <div>
              <h2 className="text-2xl md:text-3xl  text-electricPurple mb-2">
                {content.best_time_title}
              </h2>
              <p className="text-base md:text-lg text-zinc-800 font-poppins leading-relaxed">
                {content.best_time_des}
              </p>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl  text-electricPurple mb-2">
                {content.weather_title}
              </h2>
              <p className="text-base md:text-lg text-zinc-800 leading-relaxed font-poppins">
                {content.weather_time_des}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default MapandText;
