import { MinimizeShopProps, ProductTypes, ShopItemsProps } from '@/types/regular'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function ShopItem({product, image}:MinimizeShopProps) {
  const productId=product.id
 
  
  return (
       <Link href={`/shop/details/${productId}`}>
        <div className='w-[300px]'>
        <div className='relative'>
            <Image src={image}
             alt='shop-item'
              className='w-[300px] h-[300px] object-cover' 
              width={500} height={500}
              />
        


            {/* {info && <div className="absolute inset-0 bg-black/40 z-10" />} */}

            {/* {info && (
            <div className="absolute inset-0 z-20 flex items-center justify-center flex-col text-center text-white px-4">
               <h1>{title}</h1>
            <p className='text-5xl uppercase font-bowlby'>{description.slice(0,5)}</p>
            </div>
            )} */}

        </div>
        <div className='flex items-center justify-center flex-col space-y-3 mt-3 font-play_flaire'>
            <h1 className='text-[16px]  font-light capitalize '>{product.description}</h1>
            <p>{product.price_in_sats} sats</p>
        </div>
      </div>
      </Link>
  )
}

export default ShopItem