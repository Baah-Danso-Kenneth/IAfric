import {configureStore} from '@reduxjs/toolkit'
import { allExperienceApi } from './features/all-experience/allExperieneApi'


export const store = configureStore({
    reducer: {
        [allExperienceApi.reducerPath]: allExperienceApi.reducer,
    },
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware().concat(allExperienceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch