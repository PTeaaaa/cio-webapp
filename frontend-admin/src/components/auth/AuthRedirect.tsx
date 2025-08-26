"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthReady } from "@/hooks/authReady/useAuthReady";
import { redirectByRole } from "@/utils/routeUtils";

// Place this component at the top of public auth pages like /signin
export default function AuthRedirect() {
  const router = useRouter();
  const { user, ready } = useAuthReady();

  useEffect(() => {
    if (!ready) return;
    if (user) {
      // already logged in -> bounce away from auth page
      redirectByRole(user.role, router, { replace: true });
    }
  }, [ready, user, router]);

  // If not logged in (or still loading), let the page render its public content.
  return null;
}
