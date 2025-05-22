import AllInclusiveTeamDestination from '@/components/content/common/AllInclusiveTeamDestination'
import { allInclusiveData } from '@/lib/data'
import React from 'react'

function VariousTrips() {
    const destination = allInclusiveData[0];
    const destination1 = allInclusiveData[1];
    const destination2 = allInclusiveData[2];
  return (
    <div>


<AllInclusiveTeamDestination 
      className='bg-[#8338EC]'
      country={destination.country}
      btnText={destination.btnText}
      members={destination.members}
    />

<AllInclusiveTeamDestination 
      className='bg-[#c5e7c0]'
      country={destination1.country}
      btnText={destination1.btnText}
      members={destination1.members}
    />


<AllInclusiveTeamDestination 
      className='bg-[#8338EC]'
      country={destination.country}
      btnText={destination.btnText}
      members={destination.members}
    />

<AllInclusiveTeamDestination 
      className='bg-[#c5e7c0]'
      country={destination1.country}
      btnText={destination1.btnText}
      members={destination1.members}
    />



<AllInclusiveTeamDestination 
      className='bg-[#c5e7c0]'
      country={destination1.country}
      btnText={destination1.btnText}
      members={destination1.members}
    />


<AllInclusiveTeamDestination 
      className='bg-[#c5e7c0]'
      country={destination1.country}
      btnText={destination1.btnText}
      members={destination1.members}
    />


<AllInclusiveTeamDestination 
      className='bg-[#FFE066]'
      country={destination1.country}
      btnText={destination1.btnText}
      members={destination1.members}
    />


    </div>
  )
}

export default VariousTrips