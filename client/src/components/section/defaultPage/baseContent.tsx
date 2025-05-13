
import React from 'react'
import { LongArrow } from './Arrow';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

function BaseContent() {
    return (
      <div className="h-screen px-10 mt-10">
        <div className="flex h-full  ">

          <div className="flex-1 border border-black border-dashed border-t-0 border-l-0 relative">
              <div className='h-[20vh]'>
                <div className='flex  p-5'>
                 <div className=''>
                    <h1 className='tracking-[0.5rem]'>unforgettable</h1>
                 </div>
                 <div className='mt-5'>
                    <h1 className='text-8xl font-bowlby'>Time</h1>
                 </div>
                 <div>
                    <h1 className='tracking-[0.5rem]'>+23354803434</h1>
                 </div>
                 </div>
              </div>
{/* 
              <div>
                 <LongArrow/>
              </div> */}

              <div className='w-full'>
                <Image src='/images/sunset.jpg' className='w-full ' alt="" width={500} height={500}/>
              </div>

              <div className='p-5'>
                <h1 className='font-dmMono'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, quo!</h1>
              </div>
          </div>

          <div className="flex-1 border border-black relative border-dashed border-r-0 border-b-0 border-l-0">
                <div className='w-full'>
                <Image src='/images/sunset.jpg' className='w-full ' alt="" width={500} height={500}/>
              </div>

              <div className='flex items-center justify-between p-5 relative'>
                <div className='w-52'>
                    <h1 className='text-8xl font-bowlby '>Memo</h1>
                    <h1 className='text-8xl font-bowlby '>ries</h1>
                </div>

                <div className='absolute top-5 right-5'>
                    <Button className='bg-[#dd] text-black p-5 text-[20px] uppercase border-black border-3'>est 2025</Button>
                </div>

              </div>


          </div>



        </div>
      </div>
    );
  }
  

export default BaseContent