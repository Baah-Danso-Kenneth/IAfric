import RecommendCard from '@/components/content/cards/RecommendCard'
import { kindwordsData } from '@/lib/data'
import React from 'react'

function KindWords() {
  return (
    <section className='py-16 md:py-20 lg:py-24 bg-[#c5e7c0] '>
            <div className='container mx-auto px-4 sm:px-6'>

                    <div className='text-center mb-12 md:mb-16'>
                        <h2 className='text-3xl sm:text-4xl md:text-5xl uppercase inline-block relative text-[#8338EC]'>
                            <span className='relative z-10'>Some kindwords </span>
                        </h2>
                    </div>

                    <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10'>
                        {kindwordsData.map((item, index) => (
                                 <div 
                                 key={index} 
                                    className="flex justify-center transform transition-transform duration-300 hover:-translate-y-2"
                                 >
                             <RecommendCard name={item.name} testimony={item.testimony} />
                                </div>
                            ))}
                        </div>
                    </div>

            </div>
    </section>  
  )
}

export default KindWords