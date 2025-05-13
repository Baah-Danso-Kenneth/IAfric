import React from 'react';

import { useAccommodation } from '@/hooks/useAccommodaion';
import SleepCard from './sleepCard';

function SleepHolder({
  image,
  name,
  description,
  experienceId
}: {
  image: string;
  name: string;
  description: string;
  experienceId: number;
}) {
  const { accommodations } = useAccommodation();

  const filterAccomodations = accommodations.filter(
    (rec) => rec.experience.id === experienceId
  );

  return (
    <div className='py-10'>
      <div className='flex items-center justify-center py-10'>
        <h1 className='font-play_flaire text-center text-5xl uppercase'>
          where you&apos;ll sleep
        </h1>
      </div>

      <div className='grid grid-cols-2 gap-5 mx-auto max-w-5xl'>
        {filterAccomodations.length > 0 ? (
          filterAccomodations.map((rec, index) => (
            <SleepCard
              key={index}
              image={rec.image}
              name={rec.name}
              location={rec.location}
              description={rec.description}
            />
          ))
        ) : (
          <div>no data</div>
        )}
      </div>
    </div>
  );
}

export default SleepHolder;
