'use client'

import { persistor, store } from "@/redux/store"
import {Provider} from 'react-redux'
import { PersistGate } from "redux-persist/integration/react"

export function Providers({children}:{children:React.ReactNode}) {
    return (
            <Provider store={store}>
            <PersistGate 
                loading={
                 <div className="flex items-center justify-center min-h-screen">
                    <div>Loading...</div>
                 </div>
            } 
             persistor={persistor}
            >
        {children}
    </PersistGate>
    </Provider>
    ) 
}