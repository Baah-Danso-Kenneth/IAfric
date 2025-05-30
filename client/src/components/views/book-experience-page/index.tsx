import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { BaseDescriptionProps } from '@/types/api.ds'
import React from 'react'

function BookExperience({data}:BaseDescriptionProps) {
  return (
    <React.Fragment>
        <Header/>
        <section className='bg-limeGreen bg-texture py-10 lg:py-20'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch min-h-[600px]'>
                    
          
                    <div className='order-2 lg:order-1'>
                        <div className='relative overflow-hidden  shadow-2xl h-full'>
                            <img 
                                src={data?.main_image || ''} 
                                alt={data?.name || 'Experience image'}
                                className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                            />
                          
                            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
                        </div>
                    </div>

                  
                    <div className='order-1 lg:order-2 space-y-6 flex flex-col justify-center'>
                        
                        {/* Title */}
                        <div>
                            <h1 className='text-3xl sm:text-4xl  lg:text-5xl xl:text-6xl uppercase text-electricPurple leading-tight'>
                                {data?.name}
                            </h1>
                            {data?.place_name && (
                                <p className='text-lg sm:text-xl text-gray-700 mt-2 font-medium'>
                                    📍 {data.place_name}
                                </p>
                            )}
                        </div>

                        {/* Duration */}
                        <div className='flex flex-wrap gap-4'>
                            {data?.duration_days && (
                                <div className='bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm'>
                                    <span className='text-electricPurple font-semibold text-sm sm:text-base'>
                                        🗓️ {data.duration_days} {data.duration_days === 1 ? 'Day' : 'Days'}
                                    </span>
                                </div>
                            )}
                            {data?.duration_nights && (
                                <div className='bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm'>
                                    <span className='text-electricPurple font-semibold text-sm sm:text-base'>
                                        🌙 {data.duration_nights} {data.duration_nights === 1 ? 'Night' : 'Nights'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className='space-y-4'>
                            {data?.short_description && (
                                <p className='text-gray-800 text-base sm:text-lg leading-relaxed'>
                                    {data.short_description}
                                </p>
                            )}
                            
                            {data?.description && data.description !== data.short_description && (
                                <p className='text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3'>
                                    {data.description}
                                </p>
                            )}
                        </div>

                        {/* Category Badge */}
                        {data?.category?.name && (
                            <div className='inline-block'>
                                <span className='bg-electricPurple text-white px-4 py-2 rounded-full text-sm font-medium'>
                                    {data.category.name}
                                </span>
                            </div>
                        )}

                        {/* Booking Button */}
                        <div className='pt-4'>
                            <Button 
                                className='bg-electricPurple hover:bg-electricPurple/90 text-white px-8 py-3 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 uppercase tracking-wide'
                                size="lg"
                            >
                                Book This Experience
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
        <Footer/>
    </React.Fragment>
  )
}

export default BookExperience