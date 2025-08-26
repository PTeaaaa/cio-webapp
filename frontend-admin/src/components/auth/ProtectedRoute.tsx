"use client";
import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; // เวอร์ชันใหม่
// import { redirectByRole } from "@/utils/routeUtils"; // ถ้าต้องใช้

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
  signinPath?: string;
};

function Fallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-500"></div>
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
    if (isLoading || isLoggingOut) return; // Don't redirect during logout

    if (!user) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`${signinPath}?next=${next}`);
      return;
    }

    if (allowedRoles?.length && (!user.role || !allowedRoles.includes(user.role))) {
      // ถ้าคุณมีฟังก์ชันกำหนดเส้นทางตาม role ก็เรียกที่นี่ได้
      // redirectByRole(user.role, router, { replace: true });
      router.replace("/not-authorized"); // หรือหน้า default ของคุณ
    }
  }, [user, isLoading, isLoggingOut, allowedRoles, pathname, router, signinPath]);

  if (isLoading || isLoggingOut || !user) return <Fallback />;
  return <>{children}</>;
}
