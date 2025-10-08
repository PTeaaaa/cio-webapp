"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AccountForm, UpdateAccountPayload } from "@/types";
import { getAllAccounts, createAccount as createAccountAPI, NewAccountPayload, getAccountById, updateAccount, deleteAccount as deleteAccountAPI } from '@/services/accounts/accountAPI';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    accounts: AccountForm[];
    accountsLoading: boolean;
    accountsError: string | null;
    refreshAccounts: () => Promise<void>;
    createAccount: (payload: NewAccountPayload) => Promise<{ success: boolean; error?: string }>;
    getAccount: (id: string) => Promise<AccountForm | null>;
    updateAccountData: (id: string, payload: UpdateAccountPayload) => Promise<{ success: boolean; error?: string }>;
    deleteAccount: (id: string, onSuccess?: () => void) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAccounts = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAccounts must be used within AccountsProvider');
    return context;
};

export function AccountsProvider({ children }: { children: React.ReactNode }) {

    const [accounts, setAccounts] = useState<AccountForm[]>([]);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [accountsError, setAccountsError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setAccountsLoading(true);
                const data = await getAllAccounts();
                if (data) {
                    setAccounts(data);
                } else {
                    setAccountsError("Failed to fetch accounts");
                }
            } catch (err) {
                setAccountsError("Error fetching accounts");
                console.error("Error fetching accounts:", err);
            } finally {
                setAccountsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const refreshAccounts = async () => {
        try {
            setAccountsLoading(true);
            const data = await getAllAccounts();
            if (data) {
                setAccounts(data);
                setAccountsError(null);
            } else {
                setAccountsError("Failed to refresh accounts");
            }
        } catch (err) {
            setAccountsError("Error refreshing accounts");
            console.error("Error refreshing accounts:", err);
        } finally {
            setAccountsLoading(false);
        }
    };

    const getAccount = async (id: string): Promise<AccountForm | null> => {
        try {
            const account = await getAccountById(id);
            return account;
        } catch (err) {
            console.error("Error fetching account:", err);
            return null;
        }
    };

    const updateAccountData = async (id: string, payload: UpdateAccountPayload): Promise<{ success: boolean; error?: string }> => {
        try {
            setAccountsError(null);
            const result = await updateAccount(id, payload);

            if (result) {
                // Update the account in the local state
                setAccounts(prevAccounts =>
                    prevAccounts.map(account =>
                        account.id === id ? result : account
                    )
                );
                return { success: true };
            } else {
                return { success: false, error: "Failed to update account" };
            }
        } catch (err: any) {
            const errorMessage = err.message || "Failed to update account";
            setAccountsError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const createAccount = async (payload: NewAccountPayload): Promise<{ success: boolean; error?: string }> => {
        try {
            setAccountsError(null);
            const result = await createAccountAPI(payload);

            // Automatically refresh accounts list after successful creation
            await refreshAccounts();

            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || "Failed to create account";

            if (err.isDuplicateUsername || errorMessage.includes('Username already exists')) {
                // Return error to be handled by the form component
                return { success: false, error: 'DUPLICATE_USERNAME' };
            }

            setAccountsError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const deleteAccount = async (id: string, onSuccess?: () => void): Promise<{ success: boolean; error?: string }> => {
        try {
            setAccountsError(null);
            await deleteAccountAPI(id);

            // Call the success callback immediately (for navigation)
            if (onSuccess) {
                onSuccess();
            }

            // Delay state update to allow navigation to complete first
            // This prevents the edit page from trying to refetch the deleted account
            setTimeout(() => {
                setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
            }, 100);

            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || "Failed to delete account";
            setAccountsError(errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    const value = useMemo(() => ({
        accounts,
        accountsLoading,
        accountsError,
        refreshAccounts,
        createAccount,
        getAccount,
        updateAccountData,
        deleteAccount
    }), [accounts, accountsLoading, accountsError]);

    if (accountsLoading) {
        return <div className="text-center py-4 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    if (accountsError) {
        return <div className="text-center py-4 text-red-500">เกิดข้อผิดพลาด: {accountsError}</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}