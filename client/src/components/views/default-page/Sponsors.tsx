import { sponsorData } from '@/lib/data'
import React from 'react'
import Image from 'next/image'

function Sponsors() {

  const repeatedSponsors = [...sponsorData, ...sponsorData];

  return (
    <section className="py-16 bg-[#c5e7c0] overflow-hidden">
      <div className="md:hidden max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {sponsorData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-2"
            >
              <div className="relative w-full h-28 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={`Sponsor ${index}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block relative whitespace-nowrap">
        <div className="inline-block animate-loopScroll hover:pause-animation">
          <div className="flex items-center gap-4">
            {repeatedSponsors.map((item, index) => (
              <div 
                key={index} 
                className="inline-flex justify-center items-center"
              >
                <div className="relative w-60 h-36 flex items-center justify-center px-2">
                  <Image
                    src={item.image}
                    alt={`Sponsor ${index}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sponsors;