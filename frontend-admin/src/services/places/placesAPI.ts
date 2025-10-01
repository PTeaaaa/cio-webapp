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

export interface CreatePlaceData {
    name: string;
    agency: string;
}

export interface CreatePlacesResponse {
    message: string;
    count: number;
    createdPlaces: {
        name: string;
        agency: string;
    }[];
}

export const createPlaces = async (placesData: CreatePlaceData[]): Promise<CreatePlacesResponse | null> => {
    try {
        const response = await apiFetch('/places/create-places', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(placesData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.message || `Failed to create places. Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        return response.json();

    } catch (error) {
        console.error("Error in createPlaces:", error);
        throw error;
    }
};