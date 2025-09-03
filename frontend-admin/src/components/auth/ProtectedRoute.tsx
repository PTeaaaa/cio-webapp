"use client";
import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext-alternative"; // เวอร์ชันใหม่
// import { redirectByRole } from "@/utils/routeUtils"; // ถ้าต้องใช้

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
  signinPath?: string;
};

function Fallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
      <p className="mt-4 text-gray-600">กำลังตรวจสอบการเข้าสู่ระบบ...</p>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  signinPath = "/signin",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isLoggingOut } = useAuth();

  // เปลี่ยนมา redirect ภายใน useEffect (ไม่ทำระหว่าง render)
  useEffect(() => {
    if (isLoading || isLoggingOut) {
      return; // Don't redirect during logout or loading
    }

    // Add delay to allow token refresh to complete during page refresh
    const timeoutId = setTimeout(() => {
      if (!user && !isLoading && !isLoggingOut) {
        console.log('PROTECTED_ROUTE: No user found after delay, redirecting to signin');
        const next = encodeURIComponent(pathname || "/");
        router.replace(`${signinPath}?next=${next}`);
        return;
      }

      if (user) {

        if (allowedRoles?.length && (!user.role || !allowedRoles.includes(user.role))) {
          console.log('PROTECTED_ROUTE: User role not allowed:', user.role);
          // ถ้าคุณมีฟังก์ชันกำหนดเส้นทางตาม role ก็เรียกที่นี่ได้
          // redirectByRole(user.role, router, { replace: true });
          router.replace("/not-found"); // หรือหน้า default ของคุณ
        }
      }
    }, 1200); // Give a bit more time for token refresh

    return () => clearTimeout(timeoutId);

  }, [user, isLoading, isLoggingOut, allowedRoles, pathname, router, signinPath]);

  // Show loading only during initial load or logout, not during token refresh
  if (isLoading || isLoggingOut) return <Fallback />;
  
  // If no user but not loading, show loading briefly to allow token refresh
  if (!user) {
    return <Fallback />;
  }
  
  return <>{children}</>;
}
