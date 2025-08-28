"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User } from "@/types";
import { apiLogin, apiLogout } from '@/services/auth/authAPI';
import { getSession } from '@/services/auth/authAPI';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggingOut: boolean; // Add this flag
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export function AuthProvider({ initialUser, children }: { initialUser: User | null; children: React.ReactNode }) {
    
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false); // Add this state
    const pathname = usePathname();
    const router = useRouter();

    // Prevent initialUser from overriding logout state
    useEffect(() => {
        if (!isLoggingOut && initialUser !== null) {
            setUser(initialUser);
        }
    }, [initialUser, isLoggingOut]);

    // CSR bootstrap (กรณีเข้าเพจ client-only หรือเปิดแท็บใหม่หลัง SSR หมดอายุ)
    useEffect(() => {
        let ignore = false;

        async function bootstrap() {
            // Only bootstrap if:
            // 1. No user is set AND
            // 2. Not on signin page AND  
            // 3. We didn't get initialUser from server (meaning this is a client-side navigation) AND
            // 4. We're not in the middle of logging out
            if (user || pathname === '/signin' || initialUser || isLoggingOut) return;
            
            setIsLoading(true);
            try {
                const sessionToken = await getSession();
                if (!ignore) setUser(sessionToken);
            } catch {
                // If session check fails, make sure user is null
                if (!ignore) setUser(null);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }
        bootstrap();
        return () => {
            ignore = true;
        };
    }, [pathname, initialUser, isLoggingOut]); // Add isLoggingOut to dependencies

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const u = await apiLogin(username, password);
            setUser(u);
            router.replace('/'); // ไปหน้าแรก/แดชบอร์ดตามจริง
            return true;
        } catch (e) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setIsLoggingOut(true); // Set logout flag
        
        try {
            // Clear user state FIRST to prevent race conditions
            setUser(null);
            
            // Call logout API and wait for it to complete
            await apiLogout();
            
            console.log('Logout API completed successfully');
            
            // Navigate to signin page
            router.push('/signin');
        } catch (error) {
            // Even if API call fails, we've cleared local state
            console.error('Logout API call failed:', error);
            setUser(null); // Ensure user is still null
            router.push('/signin');
        } finally {
            setIsLoading(false);
            // Reset logout flag after a delay to ensure page navigation completes
            setTimeout(() => setIsLoggingOut(false), 2000);
        }
    };

    const value = useMemo(() => ({ user, isLoading, isLoggingOut, login, logout }), [user, isLoading, isLoggingOut]);
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}