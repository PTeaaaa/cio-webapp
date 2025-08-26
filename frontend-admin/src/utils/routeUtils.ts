import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function pathForRole(role?: string): string {
    switch (role) {
        case "admin":
            return "/";
        case "user":
            return "/";
        default:
            return "/";
    }
}

export function redirectByRole(
    role: string | undefined,
    router: AppRouterInstance,
    opts?: {  replace?: boolean }
) {
    const go = opts?.replace ? router.replace : router.push;
    go(pathForRole(role));
}