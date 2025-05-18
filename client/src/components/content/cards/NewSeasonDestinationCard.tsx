import Image from 'next/image';
import React from 'react'

function NewSeasonDestinationCard({
    image,
    price,
    description,
  }: {
    image: string;
    price: number;
    description: string;
  }) {
    return (
     <div>
      <div className="relative w-[300px] h-[300px] overflow-hidden group ">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            alt={`${price}.txt`}
            src={image}
            fill
            className="object-cover"
            sizes="350px"
          />
        </div>
  
        {/* Content */}

      </div>

      <div className="mt-2 text-white  space-y-2">
          <h1 className="text-lg font-semibold">{description}</h1>
          <h2 className="text-md font-medium">{price} sats</h2>
        </div>

      </div>
    );
  }

  export default NewSeasonDestinationCard