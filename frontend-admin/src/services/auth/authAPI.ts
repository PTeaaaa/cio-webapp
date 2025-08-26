import { apiFetch } from "../apiFetch/apiFetch";
import { User } from "@/types";

export async function apiLogin(username: string, password: string): Promise<User> {
    const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    // backend จะเป็นคน set cookie "sid" ให้เรา
    return data.user as User;
}

export async function apiLogout(): Promise<void> {
    try {
        const res = await apiFetch('/auth/logout', { method: 'POST' });
        if (!res.ok) {
            console.warn('Logout API returned non-OK status:', res.status);
        }
    } catch (error) {
        console.error('Logout API call failed:', error);
        // Don't throw - we want logout to succeed even if API fails
    }
}

export async function getSession(): Promise<User | null> {
    const res = await apiFetch('/auth/session', {
        method: 'GET'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user as User;
}
