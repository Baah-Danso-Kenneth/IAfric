import RecommendCard from '@/components/content/cards/RecommendCard';
import { testimonials } from '@/lib/data';
import React from 'react';


function PeopleTaught() {


  return (
    <section className="bg-[#c5e7c0] py-10 sm:py-14 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-center transform transition-transform duration-300 hover:-translate-y-2"
            >
              <RecommendCard name={item.name} testimony={item.testimony} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default PeopleTaught;