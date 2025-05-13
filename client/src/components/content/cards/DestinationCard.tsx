import React from 'react'
import Image from 'next/image'
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function DestinationCard({ image, name }: { image: string; name: string }) {
    return (
      <div className="relative w-[300px] h-[350px] overflow-hidden  shadow-lg group cursor-pointer">
        {/* Image with proper sizing and object-fit */}
        <div className="absolute inset-0">
          <Image 
            src={image} 
            alt={`${name} destination`} 
            fill 
            className="object-cover"
            sizes="350px"
          />
        </div>
  
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
        
        {/* Content container with flexbox for positioning */}
        <div className="relative h-full w-full flex flex-col justify-between p-6 text-white">
          {/* Title centered vertically and horizontally */}
          <div className="flex-grow flex items-center justify-center">
            <h1 className="text-2xl md:text-4xl uppercase text-center break-words max-w-[300px]">
              {name}
            </h1>
          </div>
          
          {/* Itinerary section at bottom */}
          <div className="flex items-center justify-center gap-2 mt-4 group-hover:text-yellow-300 transition-colors duration-300">
            <h2 className="text-[15px] font-medium">see itinerary</h2>
            <MdKeyboardDoubleArrowRight className="text-lg" />
          </div>
        </div>
      </div>
    );
  }

export default DestinationCard