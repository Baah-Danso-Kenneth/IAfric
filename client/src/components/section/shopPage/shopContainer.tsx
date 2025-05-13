import { shopItemsContent } from '@/lib/data'
import React from 'react'
import ShopItem from './shopItem'
import { useShop } from '@/hooks/useShop';
import Link from 'next/link';

function ShopContainer() {
  const {products} = useShop()

    return (
      <div className='mt-20 border-b-0 border-2 p-5 border-[#ccc] border-l-0 border-r-0'>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 p-5">
          {products.map(({ image, description, price_in_sats,product}, index) => (

            <ShopItem
            key={product.slug}
              image={image}
              description={description}
              price_in_sats={price_in_sats} 
              product={product} />
          ))}
        </div>
      </div>
    );
  }
  

export default ShopContainer