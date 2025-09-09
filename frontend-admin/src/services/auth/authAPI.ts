import { apiFetch } from "../apiFetch/apiFetch";
import { User } from "@/types";

export async function apiLogin(username: string, password: string, rememberMe: boolean = true): Promise<User> {
    const res = await apiFetch('/auth/login', {
        method: 'POST',
        json: { username, password, rememberMe },
        skipAuth: true, // Skip auth for login endpoint
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    
    console.log('✅ AUTH_API: Login successful, tokens set in secure HTTP-only cookies');
    
    // No need to store tokens in localStorage - they're in secure cookies
    // backend sets both access token (at) and refresh token (rt) cookies
    return data.user as User;
}

export async function apiLogout(): Promise<void> {
    try {
        const res = await apiFetch('/auth/logout', { 
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
            skipAuth: true, // Don't send Authorization header for logout
        });
        
        // No need to clear localStorage - tokens are in HTTP-only cookies
        // Backend will clear both access token (at) and refresh token (rt) cookies
        
        if (!res.ok) {
            console.warn('Logout API returned non-OK status:', res.status);
        }
        console.log('Logout API completed with status:', res.status);
    } catch (error) {
        console.error('Logout API call failed:', error);
        // Don't throw - we want logout to succeed even if API fails
    }
}

export async function getSession(): Promise<User | null> {
    try {
        const res = await apiFetch('/auth/session', {
            method: 'GET'
        });
        
        if (!res.ok) {
            console.log('AUTH_API: Session check failed with status:', res.status);
            return null;
        }
        
        const data = await res.json();
        return data.user as User;
    } catch (error) {
        console.error('AUTH_API: Session check error:', error);
        return null;
    }
}
