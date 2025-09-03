import { apiFetch } from "../apiFetch/apiFetch";
import { User } from "@/types";

export async function apiLogin(username: string, password: string): Promise<User> {
    const res = await apiFetch('/auth/login', {
        method: 'POST',
        json: { username, password }, // Use json instead of body
        skipAuth: true, // Skip auth for login endpoint
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    
    // Store the access token in localStorage
    if (data.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
    }
    
    // backend จะเป็นคน set refresh token cookie "rt" ให้เรา
    return data.user as User;
}

export async function apiLogout(): Promise<void> {
    try {
        const res = await apiFetch('/auth/logout', { 
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent
            skipAuth: true, // Don't send Authorization header for logout
        });
        
        // Clear access token from localStorage regardless of API response
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
        
        if (!res.ok) {
            console.warn('Logout API returned non-OK status:', res.status);
        }
        console.log('Logout API completed with status:', res.status);
    } catch (error) {
        console.error('Logout API call failed:', error);
        // Clear access token even if API fails
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
        // Don't throw - we want logout to succeed even if API fails
    }
}

export async function getSession(): Promise<User | null> {
    try {
        // Check if we have an access token
        if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.log('AUTH_API: No access token found in localStorage');
                return null;
            }
        }

        const res = await apiFetch('/auth/session', {
            method: 'GET'
        });
        
        if (!res.ok) {
            console.log('AUTH_API: Session check failed with status:', res.status);
            
            // If it's 401, the apiFetch should have already tried to refresh
            // If we're still getting 401, it means refresh failed
            if (res.status === 401) {
                console.log('AUTH_API: Token refresh failed or no refresh token available');
                // Clear the invalid access token
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                }
            }
            return null;
        }
        
        const data = await res.json();
        return data.user as User;
    } catch (error) {
        console.error('AUTH_API: Session check error:', error);
        // Clear potentially invalid token on error
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
        return null;
    }
}
