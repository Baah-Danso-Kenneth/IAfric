'use client'
import React from 'react'
import ShopContainer from './shopContainer'
import ShopItemsHeader from './shopItemsHeader'

function ShopPage() {
  return (
    <div className='mx-20'>
      <ShopItemsHeader/>
      <ShopContainer/>
    </div>
  )
}

export default ShopPage