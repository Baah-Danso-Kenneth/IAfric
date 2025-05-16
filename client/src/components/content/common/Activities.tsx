import { ActivityProps } from '@/types/regular.dt'
import clsx from 'clsx'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'


function Activities({
    image1,image2, image3,
     path,title, description,
     bgColor,isReversed, primaryImageIndex,btnText
    }:ActivityProps) {

    const images = [image1, image2, image3]
    const primaryImage = images[primaryImageIndex];
    const secondaryImages = images.filter((_,index)=> index !== primaryImageIndex);

    return (
        <section className={clsx("py-16 px-4", bgColor)}>
          <div className="max-w-7xl mx-auto ">
            <div className={clsx(
              "grid gap-8 items-center",
              isReversed ? "md:flex md:flex-row-reverse" : "md:flex"
            )}>
              {/* Content Column */}
              <div className="md:w-1/2 space-y-6 text-center md:text-left md:pr-8 place-self-start">
                <h2 className="text-3xl md:text-4xl uppercase text-white mb-4 ">{title}</h2>
                <p className="text-white text-lg">{description}</p>
                
                {path && (
                  <div className="mt-8">
                    <Button 
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-md font-medium"
                    >
                      {btnText}
                    </Button>
                  </div>
                )}
              </div>
    
              {/* Images Column */}
              <div className="md:w-1/2">
                <div className="grid grid-cols-2 gap-4 relative">
                  {/* Large Main Image */}
                  <div className="col-span-2 relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image 
                      src={primaryImage} 
                      alt="Primary activity" 
                      fill 
                      className="object-cover"
                    />
                  </div>
    
                  {/* Two Smaller Images */}
                  <div className="relative h-40 md:h-48 rounded-lg overflow-hidden shadow-md">
                    <Image 
                      src={secondaryImages[0]} 
                      alt="Secondary activity 1" 
                      fill 
                      className="object-cover"
                    />
                  </div>
    
                  <div className="relative h-40 md:h-48 rounded-lg overflow-hidden shadow-md">
                    <Image 
                      src={secondaryImages[1]} 
                      alt="Secondary activity 2" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
}

export default Activities