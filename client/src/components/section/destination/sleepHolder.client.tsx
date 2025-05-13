'use client'

import dynamic from "next/dynamic"

export const SleepHolder = dynamic(()=>import('./sleepHolder'),{
    ssr: false
})