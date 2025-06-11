import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import { allExperienceApi } from './features/all-experience/allExperieneApi'
import { listProductsApi } from './features/list-products/list-products'
import { paymentsApi } from './features/payment/paymentApi'
import cartReducer from './features/carts/cartSlice'
import sessionStorage from 'redux-persist/es/storage/session'



const persistConfig = {
  key: 'root',
  storage:sessionStorage,
  whitelist: ['cart'], 
  blacklist: ['allExperienceApi', 'listProductsApi', 'paymentsApi'] 
}


const rootReducer = combineReducers({
  [allExperienceApi.reducerPath]: allExperienceApi.reducer,
  [listProductsApi.reducerPath]: listProductsApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  cart: cartReducer
})


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
         
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'listApi/executeQuery/pending',
          'listApi/executeQuery/fulfilled', 
          'listApi/executeQuery/rejected',
          'cart/getCurrentCart/fulfilled',
          'cart/addItemToCart/fulfilled'
        ],
        ignoredActionPaths: ['meta.baseQueryMeta', 'payload.cart', 'register'],
        ignoredPaths: [
          'cart.cart',
          'api.queries',
          'listProductsApi.queries',
          'allExperienceApi.queries', 
          'paymentsApi.queries',
          '_persist'
        ],
      },
    }).concat(
      allExperienceApi.middleware,
      listProductsApi.middleware,
      paymentsApi.middleware,
    ),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch