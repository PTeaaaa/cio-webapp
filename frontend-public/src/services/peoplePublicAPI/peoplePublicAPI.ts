import { PersonForm, PeopleResponse } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL;
if (!BACKEND_URL) {
  console.warn("NEXT_PUBLIC_NESTJS_API_URL is not defined in Server Component context.");
}

export const getPersonByPersonId = async (personId: string): Promise<PersonForm | null> => {

    if (!personId) {
        return null;
    }

    try {
        const url = `${BACKEND_URL}/people/getPersonByPersonId/${personId}`; // ตรวจสอบ URL นี้

        const response = await fetch(url, {
            method: 'GET',
            // cache: 'no-store', // หากต้องการให้ fetch ข้อมูลใหม่ทุกครั้ง
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const errorBody = await response.text(); // อ่านเป็น text ก่อนเพื่อ debug
            throw new Error(`Failed to fetch person for ID: ${personId} with status ${response.status}. Body: ${errorBody.substring(0, 100)}`); // ตัด body ให้สั้นลง
        }

        const personData: PersonForm = await response.json();
        return personData;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch person data: ${errorMessage}`);
    }
};

export const getPeopleByPlaceId = async (placeId: string, page?: number, limit?: number): Promise<PeopleResponse | null> => {

    if (!placeId) {
        return null;
    }

    try {
        const url = `${BACKEND_URL}/people/getpeoplebyplaceId-public/${placeId}?page=${page}&limit=${limit}`; // ตรวจสอบ URL นี้

        const response = await fetch(url, {
            method: 'GET',
            // cache: 'no-store', // หากต้องการให้ fetch ข้อมูลใหม่ทุกครั้ง
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const errorBody = await response.text(); // อ่านเป็น text ก่อนเพื่อ debug
            throw new Error(`Failed to fetch person for ID: ${placeId} with status ${response.status}. Body: ${errorBody.substring(0, 100)}`); // ตัด body ให้สั้นลง
        }

        const peopleData: PeopleResponse = await response.json();
        return peopleData;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch person data: ${errorMessage}`);
    }
}