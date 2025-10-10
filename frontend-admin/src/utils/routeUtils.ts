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

    // =============== Admin routes =============== //

    // List pages
    "/listaccounts": ["admin"],

    // Edit pages
    "/edit-account": ["admin"],

    // Add new pages
    "/addaccount": ["admin"],
    "/addplace": ["admin"],


    // =============== User/Admin routes =============== //

    // List pages
    "/listpeople": ["admin", "user"],
    "/listplaces": ["admin"],

    // Edit pages
    "/edit-person": ["admin", "user"],
    "/edit-place": ["admin", "user"],

    // Add new pages
    "/addperson": ["admin", "user"],


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