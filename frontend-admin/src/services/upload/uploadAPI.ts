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

    console.log('🔄 Starting upload for person:', personId);
    console.log('📁 File details:', { name: file.name, size: file.size, type: file.type });

    try {
        const response = await apiFetch(`/people/${personId}/upload-image`, {
            method: 'POST',
            formData: formData, // Use formData option instead of body
            headers: {}, // Don't set Content-Type for FormData, let browser set it
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                // If response is not JSON, create a generic error
                errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
            }
            console.error('❌ Upload failed:', errorData);
            throw new Error(errorData.message || 'Failed to upload image.');
        }

        const data = await response.json();
        console.log('✅ Upload successful:', data);
        return data.imageUrl;
    }
    catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('💥 Error in uploadPersonImage:', errorMessage);
        
        // Provide more specific error messages
        if (error instanceof TypeError && errorMessage.includes('Failed to fetch')) {
            throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
        }
        
        throw new Error(`Failed to upload image: ${errorMessage}`);
    }
};
