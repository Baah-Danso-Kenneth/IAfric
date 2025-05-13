import { Button } from '@/components/ui/button'
import React from 'react'

export function HelpYouDecide() {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-[#8338EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            {/* Heading - responsive text size */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                         text-white uppercase mb-4 sm:mb-6">
              thinking about where to visit?
            </h2>
            
            {/* Description - responsive text and width */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl
                        text-white/90 mb-6 sm:mb-8 lg:mb-10 
                        max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore magni maiores 
              consequatur voluptatibus, ullam illum.
            </p>
    
            <Button className="px-6 py-3 sm:px-8 sm:py-4 lg:py-4
                            text-sm sm:text-base md:text-lg 
                            bg-[#6e2bcc] uppercase hover:bg-[#5f24af] 
                            text-white font-medium rounded-sm
                            transition-all duration-300">
              Chat with dester
            </Button>
          </div>
        </div>
      </section>
    );
  }