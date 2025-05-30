import { images } from '@/lib/data'
import React from 'react'
import Image from 'next/image'


function Gallery() {
 return (
    <div className='w-full py-10 lg:py-16  bg-limeGreen  bg-texture'>
      <div className=' px-5'>
        
        {/* Images Container */}
        <div className='flex flex-wrap justify-center items-center gap-4 lg:gap-8'>
          {images.map((image, index) => (
            <div 
              key={index}
              className={`relative transform transition-all duration-300 hover:scale-105 hover:z-10 ${image.rotation}`}
            >
              {/* Polaroid-style frame */}
              <div className='bg-white p-3 lg:p-4 shadow-xl rounded-sm'>
                <div className='relative w-48 h-36 lg:w-64 lg:h-48 overflow-hidden'>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className='object-cover rounded-sm'
                    sizes="(max-width: 768px) 192px, 256px"
                  />
                </div>
                
                {/* Optional caption space */}
                <div className='h-8 lg:h-12 flex items-center justify-center'>
                  <span className='text-gray-600 text-sm lg:text-base font-handwriting'>
                    {/* You can add captions here if needed */}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default Gallery