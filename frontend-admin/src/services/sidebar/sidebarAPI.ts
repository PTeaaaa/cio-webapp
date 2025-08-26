import { apiFetch } from '../apiFetch/apiFetch';

export const getSidebarItems = async (): Promise<any[]> => {
    try {
        const response = await apiFetch('/sidebar-items');
        console.log('getSidebarItems response:', response);

        if (!response.ok) {
            console.error(`Failed to fetch sidebar items. Status: ${response.status}`);
            
            // If it's a 401 (unauthorized), return empty array gracefully
            if (response.status === 401) {
                console.log('User not authenticated, returning empty sidebar items');
                return [];
            }
            
            return [];
        }

        const data = await response.json();
        console.log('getSidebarItems data:', data);
        return data;
    }
    catch (error) {
        console.error("Error in getSidebarItems:", error);
        return [];
    }
};