import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function MembershipHeroSection() {
  return (
    <div className='relative h-screen w-full'>
        <div className='grid grid-cols-1 lg:grid-cols-2 h-full w-full'>
            {/* Image Section */}
            <div className="relative w-full">
                <Image 
                    src="/images/hero-img.jpg"
                    alt="section"
                    fill
                    priority
                    className='object-cover'
                />
            </div>

            {/* Content Section */}
            <div className="relative w-full bg-white bg-texture flex items-center justify-center">
                <div className='w-full max-w-3xl mx-auto px-5 lg:px-8 flex items-center justify-center min-h-full'>
                    <div className='text-center space-y-6 lg:space-y-8 w-full'>
                        {/* Main Heading */}
                        <div>
                            <h1 className='text-2xl md:text-3xl lg:text-4xl  uppercase leading-tight text-electricPurple'>
                                Join the litrafric community
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <div>
                            <p className='text-lg md:text-xl text-gray-700 font-medium'>
                                Discover amazing travel experiences across Africa.
                            </p>
                        </div>

                      
                        <div>
                            <p className='text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl'>
                                Join thousands of travelers exploring the beauty, culture, and adventure that Africa has to offer. Become part of our community today.
                            </p>
                        </div>

                        
                        <div className='pt-4'>
                            <Button className='py-5 bg-electricPurple hover:bg-electricPurple/90 text-white px-8 lg:py-7 text-base md:text-lg uppercase font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg'>
                                Join Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default MembershipHeroSection