

import React from 'react';
import ShopScreen from './ShopScreen';
import Footer from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'


function ShopPage() {
  return (
    <React.Fragment>
      <Header />
       <ShopScreen/>
      <Footer />
    </React.Fragment>
  );
}

export default ShopPage;
