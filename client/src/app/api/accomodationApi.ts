import axios from 'axios';


export async function fetchAllAccommodations(){
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/accommodations/`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}