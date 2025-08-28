import { apiFetch } from '../apiFetch/apiFetch';

/**
 * อัปโหลดไฟล์รูปภาพสำหรับ Person ไปยัง Backend
 * @param file ไฟล์รูปภาพ (File object)
 * @param personId ID ของบุคคลที่ต้องการอัปโหลดรูปภาพ
 * @returns Promise ที่ resolve ด้วย URL ของรูปภาพที่อัปโหลดสำเร็จ
 */

export const uploadPersonImage = async (file: File, personId: string): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await apiFetch(`/upload/${personId}`, {
            method: 'POST',
            body: formData,
            headers: {},
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload image.');
        }

        const data = await response.json();
        return data.imageUrl;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error in uploadPersonImage:', errorMessage);
        throw new Error(`Failed to upload image: ${errorMessage}`);
    }
};