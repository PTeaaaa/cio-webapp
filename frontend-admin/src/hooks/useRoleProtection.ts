import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { canAccessPath, pathForRole } from "@/utils/routeUtils";

/**
 * Hook for protecting routes based on user roles
 * @param requiredRoles Array of roles that can access the current route
 * @param redirectPath Optional custom redirect path (defaults to role-based path)
 * @returns Object with user info and access status
 */
export function useRoleProtection(
  requiredRoles?: string[], 
  redirectPath?: string
) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const hasAccess = user?.role ? (
    requiredRoles ? 
      requiredRoles.includes(user.role) : 
      canAccessPath(user.role, pathname)
  ) : false;

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Not logged in - handled by ProtectedRoute
      return;
    }

    if (!hasAccess) {
      const targetPath = redirectPath || pathForRole(user.role);
      console.log(`Access denied for role ${user.role} on ${pathname}, redirecting to ${targetPath}`);
      router.replace(targetPath);
    }
  }, [user, isLoading, hasAccess, pathname, redirectPath, router]);

  return {
    user,
    isLoading,
    hasAccess,
    userRole: user?.role,
  };
}

/**
 * Simple hook to check if current user can access a specific path
 * @param path Path to check access for
 * @returns boolean indicating access permission
 */
export function useCanAccess(path: string): boolean {
  const { user } = useAuth();
  return canAccessPath(user?.role, path);
}

/**
 * Hook to get the appropriate home path for current user
 * @returns Home path based on user role
 */
export function useUserHomePath(): string {
  const { user } = useAuth();
  return pathForRole(user?.role);
}
