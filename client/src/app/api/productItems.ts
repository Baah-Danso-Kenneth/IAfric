import axios from "axios";


export async function fetchAllProductItems(){
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/detail-products/`)
        return res.data
    } catch (error) {
        throw Error
    }
}