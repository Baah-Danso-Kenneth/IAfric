import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import React from 'react'
import CartContent from './CartContent'

export function CartPage() {
  return (
    <React.Fragment>
        <Header/>
          <CartContent/>
        <Footer/>
    </React.Fragment>
  )
}