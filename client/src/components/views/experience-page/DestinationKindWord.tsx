import { AllKindWords } from '@/types/api.ds'
import React from 'react'
import RecommendCard from '@/components/content/cards/RecommendCard'

function DestinationKindWord({ data }: AllKindWords) {

    return (
        <section className='py-16 lg:py-24 bg-limeGreen bg-texture'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center'>
                    {data?.kind_words.map(({ id, name, words }, index) => (
                        <RecommendCard
                            key={id || index+1}
                            name={name}
                            testimony={words}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default DestinationKindWord