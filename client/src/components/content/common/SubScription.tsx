import { Button } from '@/components/ui/button'
import React from 'react'

function SubScription() {
  return (
   <div className='py-20'>
    <div className='max-w-[50%] mx-auto space-y-10'>
         <div className='flex justify-between items-center'>

            <div className='flex gap-5'>
                <h1 className='font-play_flaire text-[25px]'>Join</h1>
                <h1 className='font-bowlby text-5xl'>Travel Africa Club</h1>
            </div>

            <div>
                <h1>Enter your mail to SubScription</h1>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Pariatur, odio.</p>
            </div>
         </div>

         <div className='flex gap-5' >
            <input type="text" className='w-full border p-2' placeholder='your email'/>
            <Button className='p-5'>join now</Button>
         </div>

         <div className="flex items-center justfiy-center gap-3">
            <input type="checkbox" className='place-self-start' />
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus facere temporibus
                 molestiae dolores aut deserunt doloribus eveniet corporis laudantium beatae.</p>
         </div>
    </div>
    </div>
  )
}

export default SubScription