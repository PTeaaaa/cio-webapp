import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function pathForRole(role?: string): string {
    switch (role) {
        case "admin":
            return "/"; // Admin dashboard
        case "user":
            return "/";  // User dashboard
        default:
            return "/"; // Default home page
    }
}

// Define which roles can access which routes
export const ROUTE_PERMISSIONS: Record<string, string[]> = {

    // Public routes (accessible to all authenticated users)
    "/": ["admin", "user", "place", "viewer"],

    // Admin only routes
    "/listaccounts": ["admin"],
    "/addaccount": ["admin"],
    "/addplace": ["admin"],
    "/edit-account": ["admin"],

    // User/Admin routes
    "/listpeople": ["admin", "user"],
    "/edit-person": ["admin", "user"],
    "/edit-place": ["admin", "user"],
    "/addnew": ["admin", "user"],
    "/listplaces": ["admin"],


    // ---------------- Example ---------------- //

    "/admin": ["admin"],
    "/admin/dashboard": ["admin"],
    "/admin/users": ["admin"],
    "/admin/places": ["admin"],
    "/admin/settings": ["admin"],

    "/user": ["admin", "user"],
    "/user/dashboard": ["admin", "user"],
    "/user/profile": ["admin", "user"],

    "/place": ["admin", "place"],
    "/place/dashboard": ["admin", "place"],
    "/place/people": ["admin", "place"],

    "/viewer": ["admin", "user", "place", "viewer"],
    "/viewer/dashboard": ["admin", "user", "place", "viewer"],

};

// Check if a user role can access a specific path
export function canAccessPath(userRole: string | undefined, path: string): boolean {
    if (!userRole) return false;

    // Check exact path match first
    if (ROUTE_PERMISSIONS[path]) {
        return ROUTE_PERMISSIONS[path].includes(userRole);
    }

    // Check parent paths (e.g., /admin/users/123 should check /admin/users, then /admin)
    const pathSegments = path.split('/').filter(Boolean);
    for (let i = pathSegments.length; i > 0; i--) {
        const parentPath = '/' + pathSegments.slice(0, i).join('/');
        if (ROUTE_PERMISSIONS[parentPath]) {
            return ROUTE_PERMISSIONS[parentPath].includes(userRole);
        }
    }

    // Default: deny access if no rule found
    return false;
}

export function redirectByRole(
    role: string | undefined,
    router: AppRouterInstance,
    opts?: { replace?: boolean }
) {
    const go = opts?.replace ? router.replace : router.push;
    go(pathForRole(role));
}