import { ExperienceData } from '@/types/api.ds';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const allExperienceApi = createApi({
    reducerPath: 'allApi',
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_URL}),
    endpoints: (builder)=>({
        getExperience: builder.query<any, string>({
            query:(slug)=>`all-experience/${slug}/`
        })
    })
})

export const {useGetExperienceQuery} = allExperienceApi;