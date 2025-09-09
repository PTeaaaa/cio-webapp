"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AccountForm, UpdateAccountPayload } from "@/types";
import { getAllAccounts, createAccount, SignupPayload, getAccountById, updateAccount } from '@/services/accounts/accountAPI';

interface AuthContextType {
    accounts: AccountForm[];
    accountsLoading: boolean;
    accountsError: string | null;
    refreshAccounts: () => Promise<void>;
    signUp: (payload: SignupPayload) => Promise<{ success: boolean; error?: string }>;
    getAccount: (id: string) => Promise<AccountForm | null>;
    updateAccountData: (id: string, payload: UpdateAccountPayload) => Promise<{ success: boolean; error?: string }>;
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

    const signUp = async (payload: SignupPayload): Promise<{ success: boolean; error?: string }> => {
        try {
            setAccountsError(null);
            const result = await createAccount(payload);
            
            // Automatically refresh accounts list after successful creation
            await refreshAccounts();
            
            return { success: true };
        } catch (err: any) {
            const errorMessage = err.message || "Failed to create account";
            setAccountsError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = useMemo(() => ({ 
        accounts, 
        accountsLoading, 
        accountsError,
        refreshAccounts,
        signUp,
        getAccount,
        updateAccountData
    }), [accounts, accountsLoading, accountsError]);

    if (accountsLoading) {
        return <div className="text-center py-4 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    if (accountsError) {
        return <div className="text-center py-4 text-red-500">เกิดข้อผิดพลาด: {accountsError}</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}