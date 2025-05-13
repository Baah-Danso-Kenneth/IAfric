'use client'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/useCategory'
import { shopItems } from '@/lib/data'
import { setCategory } from '@/redux/features/slices/categorySlice'
import { getAllItems } from '@/redux/features/slices/shopSlice'

import clsx from 'clsx'

import { useDispatch } from 'react-redux'


function ShopItemsHeader() {
    const {selected, categories,loading} = useCategories()
    const dispatch = useDispatch()

    const handleClick=(slug:string)=>{
        dispatch(setCategory(slug))
    }

  return (
    <div>
        <div className='flex items-center justify-center p-10'>
            <h1 className='font-outfit text-8xl uppercase'>Shop</h1>
        </div>

        <div className='flex space-x-5 items-center justify-center'>
            <Button
              className={clsx(selected === 'all' ? 'default' : 'outline')}
              onClick={()=>handleClick('all')}
            >
                All
            </Button>
            
            {
                categories.map(({name, slug},index)=>(
                    <Button key={index} className='border px-5 text-nowrap hover:text-white uppercase text-black border-black bg-transparent p-2 rounded-[10px]'>
                        {name}
                    </Button>
                ))
            }

        </div>
     </div>
  )
}

export default ShopItemsHeader