import { apiFetch } from '../apiFetch/apiFetch';
import { AccountForm } from '@/types';

interface ApiResponse {
    data: AccountForm[];
    meta: {
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    };
}

export const getAllAccounts = async (): Promise<AccountForm[] | null> => {
    try {
        const response = await apiFetch(`/accounts/get-allaccounts`);

        if (!response.ok) {
            console.error(`Failed to fetch accounts. Status: ${response.status}`);
            return null;
        }

        const apiResponse: ApiResponse = await response.json();
        return apiResponse.data; // Extract the data array from the response

    } catch (error) {
        console.error("Error in getAllAccounts:", error);
        return null;
    }
};