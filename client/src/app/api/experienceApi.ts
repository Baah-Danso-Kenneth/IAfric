import axios from 'axios';


export async function fetchAllExperiences(){
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/experiences/`);
        return res.data;

    } catch (error) {
        console.error('Error fetching experiences',error);
        
    }
}