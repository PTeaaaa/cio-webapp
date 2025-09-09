import { apiFetch } from '../apiFetch/apiFetch';
import { Place } from '@/types';

export const getAllPlaces = async (): Promise<Place[] | null> => {
    try {
        const response = await apiFetch('/places/all');

        if (!response.ok) {
            console.error(`Failed to fetch places. Status: ${response.status}`);
            return null;
        }

        return response.json();
        
    } catch (error) {
        console.error("Error in getAllPlaces:", error);
        return null;
    }
};

export const getPlaceById = async (placeId: string): Promise<Place | null> => {
    try {
        const response = await apiFetch(`/places/by-id/${placeId}`);

        if (!response.ok) {
            console.error(`Failed to fetch place. Status: ${response.status}`);
            return null;
        }

        return response.json();
        
    } catch (error) {
        console.error("Error in getPlaceById:", error);
        return null;
    }
};