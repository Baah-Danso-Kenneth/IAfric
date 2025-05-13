import axios from 'axios'

export async function fetchAllItineraries (){
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/itineraries/`);
        return res.data

    } catch (error) {
        console.error('Error fetching itineraries')
        throw error
    }
}