// SleepCard.tsx
import Image from 'next/image';
import React from 'react';

function SleepCard({
  image,
  name,
  description,
  location
}: {
  image: string;
  name: string;
  description: string;
  location: string;
}) {
  return (
    <div className='mb-10'>
      <div className='w-[500px]'>
        <Image
          alt='accommodation image'
          className='w-[500px] h-[350px] object-cover'
          src={image}
          width={500}
          height={500}
        />
        <div className='space-y-3 flex flex-col items-center justify-center mt-3'>
          <h1 className='text-3xl uppercase'>{name}</h1>
          <h2 className='text-2xl font-poppins'>{location}</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default SleepCard;
