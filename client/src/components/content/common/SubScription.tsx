import { Button } from '@/components/ui/button';
import React, { ReactNode } from 'react';
import CircularText from './CircleText';
import clsx from 'clsx';

function Subscription({className}:{className?:ReactNode}) {
  return (
    <section className={clsx("py-12 sm:py-16 md:py-20 bg-white",className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto   overflow-hidden ">
          <div className="p-6 sm:p-8 md:p-10">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center mb-8">
              {/* Logo column */}
              <div className="flex justify-center md:justify-start">
                <CircularText />
              </div>
              
              {/* Text column */}
              <div className="text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-800">
                  Enter your email to Subscribe
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Join our exclusive Travel Africa Club newsletter and be the first to know about 
                  special offers, destinations, and travel tips.
                </p>
              </div>
            </div>
            
            {/* Email input and button */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input 
                  type="email" 
                  className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#8338EC] focus:border-transparent" 
                  placeholder="Your email address"
                  aria-label="Email address"
                  required
                />
                <Button className="bg-[#8338EC] hover:bg-[#7029d6] text-white px-10 text-[15px] lg:text-[18px] py-6  font-medium">
                  Join Now
                </Button>
              </div>
            </div>
            
            {/* Checkbox and terms */}
            <div className="flex items-start gap-3">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="h-4 w-4 rounded border-gray-300 text-[#8338EC] focus:ring-[#8338EC]" 
                />
              </div>
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-500">
                I agree to receive the Travel Africa Club newsletter and understand that I can unsubscribe at any time. 
                By joining, I agree to the Terms & Conditions and Privacy Policy.
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscription;