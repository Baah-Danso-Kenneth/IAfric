import React from 'react'
import Image from 'next/image'


function PopularSiteImage({image}:{image:string}) {
  return (
         <div className=''>
          <div className="relative w-[150px] h-[150px] overflow-hidden group ">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image
                alt={`${image}.txt`}
                src={image}
                fill
                className="object-cover"
                sizes="150px"
              />
            </div>
            </div>

            <div className='mt-2 space-y-2 uppercase font-play_flaire text-sm'>
              <p>elmina castle </p>
              <p>ghana</p>
            </div>
          </div>
  )
}

export default PopularSiteImage