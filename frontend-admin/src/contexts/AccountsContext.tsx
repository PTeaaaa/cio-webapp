"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AccountForm } from "@/types";
import { getAllAccounts } from '@/services/accounts/accountAPI';

interface AuthContextType {
    accounts: AccountForm[];
    accountsLoading: boolean;
    accountsError: string | null;
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

    const value = useMemo(() => ({ accounts, accountsLoading, accountsError }), [accounts, accountsLoading, accountsError]);

    if (accountsLoading) {
        return <div className="text-center py-4 text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    if (accountsError) {
        return <div className="text-center py-4 text-red-500">เกิดข้อผิดพลาด: {accountsError}</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}