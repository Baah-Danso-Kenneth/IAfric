import { configureStore } from '@reduxjs/toolkit'
import { allExperienceApi } from './features/all-experience/allExperieneApi'
import { listProductsApi } from './features/list-products/list-products'
import { paymentsApi } from './features/payment/paymentApi'
import cartReducer from './features/carts/cartSlice'

export const store = configureStore({
    reducer: {
        [allExperienceApi.reducerPath]: allExperienceApi.reducer,
        [listProductsApi.reducerPath]: listProductsApi.reducer,
        [paymentsApi.reducerPath]: paymentsApi.reducer,
        cart: cartReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    // Add these RTK Query action patterns
                    'listApi/executeQuery/pending',
                    'listApi/executeQuery/fulfilled', 
                    'listApi/executeQuery/rejected',
                    
                    // And your existing ones
                    'cart/getCurrentCart/fulfilled',
                    'cart/addItemToCart/fulfilled'
                    ],
              
                ignoredActionPaths: ['meta.baseQueryMeta','payload.cart'],
                
                ignoredPaths: [
                    'cart.cart',
                    'api.queries',

                    'listProductsApi.queries',
                    'allExperienceApi.queries', 
                    'paymentsApi.queries'

                ],
            },
        }).concat(
            allExperienceApi.middleware,
            listProductsApi.middleware,
            paymentsApi.middleware,
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch