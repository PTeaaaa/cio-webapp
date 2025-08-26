import { PlaceForm, PlacesResponse } from "@/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL;

if (!BACKEND_URL) {
  console.warn("NEXT_PUBLIC_NESTJS_API_URL is not defined in Server Component context.");
}

/**
 * ดึงข้อมูล Place ทั้งหมดที่ตรงกับ agency ที่ระบุ
 * ฟังก์ชันนี้ออกแบบมาสำหรับ Server Components (เช่น page.tsx)
 * @param agency ชื่อหน่วยงานที่ต้องการค้นหา
 * @returns Promise ที่ resolve ด้วย Array ของ PlaceForm objects หรือ null หากไม่พบ
 */
export const getPlacesByAgency = async (agency: string, page: number, limit: number): Promise<PlacesResponse | null> => {
    // หาก agency ไม่มีค่า, คืนค่า null ทันที
    if (!agency) {
        console.warn("getPlacesByAgency: agency is missing.");
        return null;
    }

    try {
        const url = `${BACKEND_URL}/places/by-agency/${agency}?page=${page}&limit=${limit}`;

        const response = await fetch(url, {
            method: 'GET',
            // cache: 'no-store', // หากต้องการให้ fetch ข้อมูลใหม่ทุกครั้ง (ไม่ใช้ cache ของ Next.js)
        });

        if (!response.ok) {

            if (response.status === 404) {
                console.log(`No places found for agency: ${agency} (404).`);
                return null;
            }

            const errorBody = await response.text(); // อ่านเป็น text ก่อนเพื่อ debug
            console.error(`Error fetching places by agency: ${agency}. Status: ${response.status}. Body: ${errorBody.substring(0, 100)}`);
            throw new Error(`Failed to fetch places for agency: ${agency} with status ${response.status}`);
        }

        // แปลง Response Body เป็น JSON และคืนค่าเป็น Array ของ PlaceForm
        const placesResponse: PlacesResponse = await response.json();
        return placesResponse;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in getPlacesByAgency for agency ${agency}:`, errorMessage);
        throw new Error(`Failed to fetch places data: ${errorMessage}`);
    }
};

export const getPlaceByID = async (placeUUID: string): Promise<PlaceForm | null> => {
    // หาก agency ไม่มีค่า, คืนค่า null ทันที
    if (!placeUUID) {
        console.warn("getPlacesByID: placeUUID is missing.");
        return null;
    }

    try {
        const url = `${BACKEND_URL}/places/by-id/${placeUUID}`;

        const response = await fetch(url, {
            method: 'GET',
            // cache: 'no-store', // หากต้องการให้ fetch ข้อมูลใหม่ทุกครั้ง (ไม่ใช้ cache ของ Next.js)
        });

        if (!response.ok) {

            if (response.status === 404) {
                console.log(`No places found for agency: ${placeUUID} (404).`);
                return null;
            }

            const errorBody = await response.text(); // อ่านเป็น text ก่อนเพื่อ debug
            console.error(`Error fetching places by agency: ${placeUUID}. Status: ${response.status}. Body: ${errorBody.substring(0, 100)}`);
            throw new Error(`Failed to fetch places for agency: ${placeUUID} with status ${response.status}`);
        }

        // แปลง Response Body เป็น JSON และคืนค่าเป็น Array ของ PlaceForm
        const placesData: PlaceForm = await response.json();
        return placesData;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in getPlacesByAgency for agency ${placeUUID}:`, errorMessage);
        throw new Error(`Failed to fetch places data: ${errorMessage}`);
    }
};
