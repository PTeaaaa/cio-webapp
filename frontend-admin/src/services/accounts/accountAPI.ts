import { apiFetch } from '../apiFetch/apiFetch';
import { AccountForm, UpdateAccountPayload } from '@/types';

interface ApiResponse {
    data: AccountForm[];
    meta: {
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    };
}

export interface NewAccountPayload {
    username: string;
    password: string;
    role: string;
    assignPlace: string[];
}

export interface NewAccountResponse {
    message: string;
    user: AccountForm;
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

export const getAccountById = async (id: string): Promise<AccountForm | null> => {
    try {
        const response = await apiFetch(`/accounts/${id}`);

        if (!response.ok) {
            console.error(`Failed to fetch account. Status: ${response.status}`);
            return null;
        }

        const account: AccountForm = await response.json();
        return account;

    } catch (error) {
        console.error("Error in getAccountById:", error);
        return null;
    }
};

export const updateAccount = async (id: string, updateData: UpdateAccountPayload): Promise<AccountForm | null> => {
    try {
        const response = await apiFetch(`/accounts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to update account. Status: ${response.status}`);
        }

        const result: AccountForm = await response.json();
        return result;

    } catch (error) {
        console.error("Error in updateAccount:", error);
        throw error;
    }
};

export const createAccount = async (accountData: NewAccountPayload): Promise<NewAccountResponse | null> => {
    try {
        const response = await apiFetch('/accounts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Handle duplicate username error specifically
            if (response.status === 409 && errorData.message?.includes('Username already exists')) {
                const duplicateError = new Error('Username already exists');
                (duplicateError as any).isDuplicateUsername = true;
                throw duplicateError;
            }

            throw new Error(errorData.message || `Failed to create account. Status: ${response.status}`);
        }

        const result: NewAccountResponse = await response.json();
        return result;

    } catch (error) {
        console.error("Error in createAccount:", error);
        throw error;
    }
};

export const deleteAccount = async (id: string): Promise<void> => {
    try {
        const response = await apiFetch(`/accounts/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete account. Status: ${response.status}`);
        }

    } catch (error) {
        console.error("Error in deleteAccount:", error);
        throw error;
    }
};