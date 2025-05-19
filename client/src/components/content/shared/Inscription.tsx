import Link from 'next/link'
import React from 'react'

function Inscription() {
  return (
    <div className='bg-[#8338EC] text-white mb-10 p-5'>
        <div className='space-y-5 '>

            <div className='flex flex-col md:flex-row  lg:flex-row justify-between items-center '>
                <div>
                     <h2 className='font-bowlby text-2xl  lg:text-4xl'>Lorem ipsum dolor sit amet.</h2>

                </div>

              <div className='flex  sm:flex-row gap-6 pt-4'>
                <div className='group'>
                  <Link href="/welcome" className="relative inline-block text-sm lg:text-lg font-medium">
                    <span className="relative z-10 text-white">Let&apos;s go</span>
                  </Link>
                  <div className='h-1 md:h-[0.8px] w-10 bg-white  lg:w-full'/>
                </div>

                <div className='group'>
                  <Link href="/welcome" className="relative inline-block text-sm lg:text-lg font-medium">
                    <span className="relative z-10 text-white">View Collection</span>
                  </Link>
                  <div className='h-1 md:h-[0.8px] bg-white w-full'/>
                </div>
              </div>

            </div>

            <p>Lorem ipsum dolor sit amet.</p>
            <p>Lorem, ipsum dolor.</p>
        </div>
    </div>
  )
}

export default Inscription