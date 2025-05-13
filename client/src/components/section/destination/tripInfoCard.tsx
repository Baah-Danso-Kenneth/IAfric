import { Button } from '@/components/ui/button'
import { TripInfoTypes } from '@/types/regular'
import clsx from 'clsx'
import Image from 'next/image'

function TripInfoCard({ image, location, date, soldOut, rooms }: TripInfoTypes) {
  return (
    <div className="w-[350px] overflow-hidden relative">

      <div className="relative w-full h-[300px]">
        <Image
          src={image}
          alt={`${location} trip image`}
          layout="fill"
          objectFit="cover"
        />

       
        {soldOut ? (
          <div className="absolute inset-0 bg-white/40 z-10" />
        ) : null}

        {soldOut ? (
          <div className="absolute top-0 right-0 z-20 bg-white text-[#ccc] px-4 p-2 text-sm font-bold shadow-md">
            SOLD OUT
          </div>
        ) : null}
      </div>

      <div className="p-4 space-y-2 ">
        <div className="flex justify-center gap-[0.2em] text-[15px] items-center uppercase">
          <p>{location}:</p>
          <p>{date}</p>
        </div>

        <div className="flex justify-center items-center">
          <Button className={clsx(`uppercase py-5 ${!soldOut ? 'bg-green-600' : 'bg-red-300'}`)}>
            {soldOut ? 'Join Waitlist' : `${rooms} rooms left`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TripInfoCard
