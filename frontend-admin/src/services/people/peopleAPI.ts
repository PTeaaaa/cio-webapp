import { apiFetch } from "../apiFetch/apiFetch";
import { CreatePersonPayload, UpdatePersonPayload, PersonForm } from "@/types";

export const createPerson = async (personData: CreatePersonPayload): Promise<PersonForm> => {
    const response = await apiFetch('/people/createpeople', {
        method: 'POST',
        body: JSON.stringify(personData),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Failed to create person');
    }

    return response.json();
};

export const getPeopleByPlaceId = async (placeId: string): Promise<any[]> => {
    if (!placeId) return [];
    const response = await apiFetch(`/people/getpeoplebyplaceId/${placeId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch people for this place');
    }

    const data = await response.json();
    return data;
};

export const getPersonByPersonId = async (personId: string): Promise<any> => {
    if (!personId) return [];
    const response = await apiFetch(`/people/getpersonbypersonId/${personId}`, {
        method: 'GET',
    });
    if (!response.ok) {
        if (response.status == 404) {
            return null;
        }
        throw new Error('Failed to fetch people for this ID')
    }
    return response.json();
};

export const updatePerson = async (id: string, personData: UpdatePersonPayload): Promise<PersonForm> => {
    const response = await apiFetch(`/people/updatepeople/${id}`, {
        method: "PUT",
        body: JSON.stringify(personData),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to update person with ID: ${id}`);
    }

    return response.json();
};

export const deletePerson = async (id: string): Promise<void> => {
    const response = await apiFetch(`/people/deletepeople/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || `Failed to delete person with ID: ${id}`)
    }
}


