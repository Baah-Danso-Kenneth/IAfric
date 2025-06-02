'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'
import { Minus, Plus, X, Edit3 } from 'lucide-react'

function CartContent() {
  const [quantity, setQuantity] = useState(1)
  const pricePerItem = 3290.00
  const subtotal = quantity * pricePerItem

  const handleQuantityChange = (action:any) => {
    if (action === 'increment') {
      setQuantity(prev => prev + 1)
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className='py-10 lg:py-20 bg-limeGreen bg-texture'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Page Header */}
        <div className='mb-8 lg:mb-12'>
          <h1 className='text-[18px] md:text-2xl lg:text-3xl uppercase  text-electricPurple font-poppins'>
            Shopping Cart
          </h1>
        </div>

        {/* Cart Items Container */}
        <div className='overflow-hidden mb-6 lg:mb-8'>
          
          {/* Cart Item */}
          <div className='p-6 lg:p-8 border-b-2 border-gray-700'>
            <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
              
              {/* Product Info Section */}
              <div className='flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1'>
                {/* Product Image */}
                <div className='flex-shrink-0'>
                  <div className='relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32  overflow-hidden'>
                    <Image 
                      src="/images/hero-img.jpg" 
                      alt="Product image" 
                      fill
                      className='object-cover hover:scale-105 transition-transform duration-300' 
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className='flex-1 space-y-2 lg:space-y-3'>
                  <h2 className='text-xl lg:text-2xl  text-gray-900 capitalize'>
                    Life Experience Package
                  </h2>
                  <p className='text-sm lg:text-base text-gray-600 leading-relaxed'>
                    An unforgettable journey through Africa's most stunning destinations with premium accommodations and expert guides.
                  </p>
                  <button className='inline-flex items-center gap-2 text-electricPurple hover:text-electricPurple/80 text-sm lg:text-base font-medium transition-colors duration-200'>
                    <Edit3 size={16} />
                    Edit Details
                  </button>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className='flex lg:flex-col min-w-[100px] items-center lg:items-center justify-center gap-3 lg:gap-2 lg:min-w-[120px]'>
                <span className='text-sm lg:text-base font-medium text-gray-700 lg:mb-2'>Quantity</span>
                <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-2'>
                  <button 
                    onClick={() => handleQuantityChange('decrement')}
                    className='w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-electricPurple transition-all duration-200 disabled:opacity-50'
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className='w-12 text-center font-bold text-lg lg:text-xl text-gray-900'>
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange('increment')}
                    className='w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-electricPurple transition-all duration-200'
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

         
              <div className='flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-3 min-w-[140px]'>
                <div className='text-right'>
                  <div className='text-xl lg:text-2xl font-bold text-gray-900'>
                    {(pricePerItem * quantity).toLocaleString()} sats
                  </div>
                  <div className='text-sm text-gray-500'>
                    {pricePerItem.toLocaleString()} sats each
                  </div>
                </div>
                <button className='w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-200'>
                  <X size={20} />
                </button>
              </div>

            </div>
          </div>

       
          <div className='p-6 lg:p-8 '>
            <div className='flex flex-col items-end justify-end gap-6'>
              
              {/* Subtotal */}
              <div className='flex items-center gap-4 text-lg lg:text-xl'>
                <span className='font-medium text-gray-700'>Subtotal:</span>
                <span className='font-bold text-gray-900'>
                  {subtotal.toLocaleString()} sats
                </span>
              </div>

              {/* Checkout Button */}
              <Button className='bg-electricPurple hover:bg-electricPurple/90 text-white py-3 lg:py-4 px-8 lg:px-10 text-lg lg:text-xl  uppercase rounded-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl'>
                Checkout
              </Button>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default CartContent