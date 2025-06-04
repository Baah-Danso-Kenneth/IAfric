import {configureStore} from '@reduxjs/toolkit'
import { allExperienceApi } from './features/all-experience/allExperieneApi'
import { listProductsApi } from './features/list-products/list-products'
import { paymentsApi } from './features/payment/paymentApi'


export const store = configureStore({
    reducer: {
        [allExperienceApi.reducerPath]: allExperienceApi.reducer,
        [listProductsApi.reducerPath]: listProductsApi.reducer,
        [paymentsApi.reducerPath]: paymentsApi.reducer,
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(
            allExperienceApi.middleware,
            listProductsApi.middleware,
            paymentsApi.middleware,
        ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch