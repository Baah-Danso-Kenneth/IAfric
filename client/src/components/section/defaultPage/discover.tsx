import { Button } from '@/components/ui/button'
import React from 'react'

function Discover() {
  return (
    <div className='flex lg:flex items-start lg:items-end justify-between mx-10 pb-5'>
         <div className='w-full lg:w-[40%] space-y-3'>
            <h1 className='font-play_flaire text-2xl text-nowrap lg:text-wrap lg:text-7xl capitalize'>discover your destination</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, deleniti!</p>
         </div>

         <div className='space-x-5'>
            <Button>ozone</Button>
            <Button>ozone</Button>
            <Button>ozone</Button>
            <Button>ozone</Button>

         </div>
    </div>
  )
}

export default Discover