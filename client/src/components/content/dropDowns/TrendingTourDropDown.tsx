'use client'
import { popularSites, topSiteData } from '@/lib/data';
import Link from 'next/link';
import React from 'react';
import PopularSiteImage from '../cards/PopularSiteImage';
import { AiOutlineClose } from "react-icons/ai";

function TrendingTourDropDown({ onClose }:{onClose:()=>void}) {
  const limitedDestinations = popularSites;

  return (
    <section className="px-4 py-10 bg-white shadow-lg relative">
      {/* Close button for mobile */}
      <div className="lg:hidden absolute top-4 right-4">
        <AiOutlineClose 
          className="text-xl cursor-pointer"
          onClick={onClose}
        />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className='place-self-start'>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {limitedDestinations.map(({ image }, index) => (
              <div key={index}>
                <PopularSiteImage image={image} />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-auto mt-8 lg:mt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {topSiteData.map((section, index) => {
              const [title, destinations] = Object.entries(section)[0];
              return (
                <div key={index}>
                  <h2 className="text-lg font-semibold text-nowrap mb-3 capitalize text-gray-800">
                    {title}
                  </h2>
                  <ul className="space-y-2">
                    {destinations.map((place, idx) => (
                      <li key={idx}>
                        <Link href={place.path} className="text-gray-700 hover:text-blue-500 hover:underline transition">
                          {place.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Popular sites label */}
      <div className='hidden lg:block absolute top-[30%] left-[5%]'>
        <h1 className='transform -rotate-90 text-lg font-semibold'>popular/sites</h1>
      </div>
    </section>
  );
}

export default TrendingTourDropDown;