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
                // Ignore these action types
                ignoredActions: ['cart/getCurrentCart/fulfilled', 'cart/addItemToCart/fulfilled'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.cart'],
                // Ignore these paths in the state
                ignoredPaths: ['cart.cart'],
            },
        }).concat(
            allExperienceApi.middleware,
            listProductsApi.middleware,
            paymentsApi.middleware,
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch