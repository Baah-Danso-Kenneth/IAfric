'use client';

import { useState } from 'react';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/redux/features/list-products/list-products';
import Loader from '@/components/content/shared/Loader';
import ShopContainer from './ShopContainer';
import ShopCategoryHeader from './ShopCategoryHeader';

function ShopScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: products, isLoading: loadingProducts } = useGetProductsQuery(selectedCategory);

  const isLoading = loadingCategories || loadingProducts;

  return (
    <div className="min-h-screen bg-limeGreen bg-texture px-6 py-10">
     <div className='flex items-center justify-center py-10'>
        <h1 className='text-2xl md:text-3xl text-center lg:text-5xl uppercase text-electricPurple'>shops</h1>
     </div>

      {categories && (
        <ShopCategoryHeader
          categories={categories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
      )}

      {isLoading ? <Loader /> : <ShopContainer data={products} />}
    </div>
  );
}

export default ShopScreen;
