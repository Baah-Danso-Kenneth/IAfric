import axios from 'axios'

export async function  fetchMapContents() {
     try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/map-content/`)
        return response.data
     } catch (error:any) {
        throw new error
     }
}

