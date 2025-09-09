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
    login: (username: string, password: string, rememberMe?: boolean) => Promise<boolean>;
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
            // 4. We're not in the middle of logging out AND
            // 5. Give some time after potential logout operations
            if (user || pathname === '/signin' || initialUser || isLoggingOut) {
                console.log('⏭️ AUTH_CONTEXT: Skipping bootstrap -', { 
                    hasUser: !!user, 
                    isSigninPage: pathname === '/signin', 
                    hasInitialUser: !!initialUser, 
                    isLoggingOut 
                });
                return;
            }
            
            console.log('🚀 AUTH_CONTEXT: Starting bootstrap process...');
            
            // Additional safety check: wait a bit to ensure any logout operations have completed
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Check again after the delay
            if (ignore || isLoggingOut) {
                return;
            }
            
            setIsLoading(true);
            try {
                const sessionUser = await getSession();
                if (!ignore && !isLoggingOut) {
                    if (sessionUser) {
                        setUser(sessionUser);
                    } else {
                        console.log('AUTH_CONTEXT: No valid session found');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('AUTH_CONTEXT: Bootstrap error:', error);
                // If session check fails, make sure user is null
                if (!ignore && !isLoggingOut) {
                    setUser(null);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }
        bootstrap();
        return () => {
            ignore = true;
        };
    }, [pathname, initialUser, isLoggingOut]); // Add isLoggingOut to dependencies

    const login = async (username: string, password: string, rememberMe: boolean = true) => {
        setIsLoading(true);
        try {
            const u = await apiLogin(username, password, rememberMe);
            setUser(u);
            router.replace('/'); // ไปหน้าแรก/แดชบอร์ดตามจริง
            return true;
        } catch (e) {
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Alternative logout method using router.replace with additional safeguards
    const logout = async () => {
        setIsLoading(true);
        setIsLoggingOut(true); // Set logout flag
        
        try {
            // Clear user state FIRST to prevent race conditions
            setUser(null);
            
            // Clear localStorage but preserve theme and other important settings
            if (typeof window !== 'undefined') {
                // Save important settings before clearing
                const savedTheme = localStorage.getItem("theme");
                
                // Clear all storage
                localStorage.clear();
                sessionStorage.clear();
                
                // Restore important settings
                if (savedTheme) {
                    localStorage.setItem("theme", savedTheme);
                }
            }
            
            // Call logout API and wait for it to complete
            await apiLogout();
            
            console.log('AUTH_CONTEXT: Logout API completed successfully');
            
            // Clear state one more time to be sure
            setUser(null);
            
            // Use hard navigation to ensure clean state
            window.location.href = '/signin';
            
        } catch (error) {
            // Even if API call fails, we've cleared local state
            console.error('AUTH_CONTEXT: Logout API call failed:', error);
            setUser(null); // Ensure user is still null
            
            // Clear storage but preserve theme even on error
            if (typeof window !== 'undefined') {
                // Save important settings before clearing
                const savedTheme = localStorage.getItem("theme");
                
                // Clear all storage
                localStorage.clear();
                sessionStorage.clear();
                
                // Restore important settings
                if (savedTheme) {
                    localStorage.setItem("theme", savedTheme);
                }
            }
            
            // Force navigation on error
            window.location.href = '/signin';
        } finally {
            setIsLoading(false);
            // Reset logout flag after navigation completes
            setTimeout(() => setIsLoggingOut(false), 3000);
        }
    };

    const value = useMemo(() => ({ user, isLoading, isLoggingOut, login, logout }), [user, isLoading, isLoggingOut]);
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
