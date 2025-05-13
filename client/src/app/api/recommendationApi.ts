import { setRecommendations } from '@/redux/features/slices/recommendationSlice';
import axios from 'axios';

export const fetchAllRecommendations = () => async (dispatch: any) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/recommendations/`);
        const data = response.data;

        const recommendations = data.map((rec: any) => ({
            name: rec.person_name,
            message: rec.message,
            experience: rec.experience, 
        }));

        dispatch(setRecommendations(recommendations));
    } catch (error) {
        console.error('Failed to fetch recommendations:', error);
    }
};
