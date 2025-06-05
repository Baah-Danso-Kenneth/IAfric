import { AddItemRequest, Cart, CartItem, RemoveItemRequest, UpdateItemRequest } from "@/types/cart.dt";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_URL}`,
    }),
    tagTypes: ['Cart'],
    endpoints: (builder)=>({
        getCurrentCart: builder.query<Cart, void>({
            query: ()=>'cart/current/',
            providesTags: ['Cart'],
        }),

        addItemToCart: builder.mutation<
          {cart:Cart, added_item: CartItem, message:string},
          AddItemRequest
        >({
            query:(data)=>({
                url:'cart/add_item/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Cart'],
        }),

            updateCartItem: builder.mutation<
        {cart: Cart, message:string},
        UpdateItemRequest
    >({
        query: (data)=>({
            url: 'cart/update_item/',
            method: 'PATCH',
            body:data,
        }),
        invalidatesTags:['Cart']
    }),

    removeCartItem: builder.mutation<
        {cart: Cart, message:string},
        RemoveItemRequest
    >({
        query: (data)=>({
            url: 'cart/remove_item/',
            method: 'DELETE',
            body: data,
        }),
        invalidatesTags: ['Cart']
    }),


    clearCart: builder.mutation<{cart: Cart, message:string},void>({
        query:(data)=>({
            url: 'cart/clear/',
            method: 'POST',
        }),
        invalidatesTags: ['Cart']
    }),
    }),
});

export const {
    useGetCurrentCartQuery,
    useAddItemToCartMutation,
    useUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = cartApi