"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthReady } from "@/hooks/authReady/useAuthReady";
import { redirectByRole } from "@/utils/routeUtils";

// Place this component at the top of public auth pages like /signin
export default function AuthRedirect() {
  const router = useRouter();
  const { user, ready, isLoggingOut } = useAuthReady();

  useEffect(() => {
    // Don't redirect during logout process
    if (isLoggingOut) {
      console.log('AUTH_REDIRECT: Logout in progress, skipping redirect');
      return;
    }
    
    if (!ready) return;
    
    if (user) {
      // already logged in -> bounce away from auth page
      console.log('AUTH_REDIRECT: User authenticated, redirecting to appropriate page');
      redirectByRole(user.role, router, { replace: true });
    }
  }, [ready, user, router, isLoggingOut]);

  // If not logged in (or still loading), let the page render its public content.
  return null;
}
