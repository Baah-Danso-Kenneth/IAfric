import { ProductProps } from "@/types/product.ds";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const listProductsApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    getProducts: builder.query<any,  string | void>({
      query: (category) => (category ? `products/?category=${category}` : 'products/'),
    }),

    getCategories:builder.query<{ id: number; name: string; slug: string }[], void>({
      query: ()=>'categories/',
    })

  }),
});

export const { useGetProductsQuery, useGetCategoriesQuery } = listProductsApi;
