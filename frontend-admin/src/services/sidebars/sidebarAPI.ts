import { apiFetch } from '../apiFetch/apiFetch';

export const getSidebarItems = async (): Promise<any[]> => {
    try {
        const response = await apiFetch('/sidebar-items', {
            method: 'GET'
        });

        if (!response.ok) {
            console.error(`SIDEBAR_API: Failed to fetch sidebar items. Status: ${response.status}`);
            
            // If it's a 401 (unauthorized), return empty array gracefully
            if (response.status === 401) {
                console.log('SIDEBAR_API: User not authenticated, returning empty sidebar items');
                return [];
            }
            
            // For other errors, also return empty array but log the error
            console.error('SIDEBAR_API: Unexpected error status, returning empty array');
            return [];
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("SIDEBAR_API: Error in getSidebarItems:", error);
        return [];
    }
};