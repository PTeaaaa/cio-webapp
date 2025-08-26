import { cookies } from 'next/headers';

const BASE = (process.env.NEXT_PUBLIC_NESTJS_API_URL ?? "").replace(/\/+$/, "");

export async function getServerSessionUser(): Promise<{ user: any } | null> {

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  const res = await fetch(`${BASE}/auth/session`, {
    method: 'GET',
    headers: { cookie: cookieHeader }, // forward cookie จากผู้ใช้จริง
    credentials: 'include',
    cache: 'no-store', // กัน back/forward cache
  });
  if (!res.ok) return null;
  return res.json();
}