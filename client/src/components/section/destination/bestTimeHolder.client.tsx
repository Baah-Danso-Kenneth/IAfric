'use client'

import { BestTimeHolderProps } from '@/types/regular'
import dynamic from 'next/dynamic'
import { FC } from 'react'

export const BestTimeHolder = dynamic<BestTimeHolderProps>(
  () => import('./bestTimeHolder').then(mod => mod.default),
  { ssr: false }
)

