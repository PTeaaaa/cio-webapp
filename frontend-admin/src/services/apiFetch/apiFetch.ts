export type ApiFetchOptions = Omit<RequestInit, 'headers' | 'credentials'> & {
  /** auto JSON.stringify และตั้ง Content-Type */
  json?: unknown;
  /** ถ้าเป็น FormData จะไม่ตั้ง Content-Type */
  formData?: FormData;
  /** ตั้ง timeout (ms) ได้ */
  timeoutMs?: number;
  /** เฮดเดอร์เพิ่มเอง */
  headers?: HeadersInit;
  /** ค่าเริ่มต้นคือ include */
  credentials?: RequestCredentials;
  /** Skip automatic JWT token attachment for public endpoints */
  skipAuth?: boolean;
};

const API_BASE = (process.env.NEXT_PUBLIC_NESTJS_API_URL ?? '').replace(/\/+$/, '');

// Endpoints that don't need authentication
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/signup', '/auth/refresh-token'];

// Token refresh state to prevent multiple concurrent refresh requests
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Helper function to check if JWT token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse it, consider it expired
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // This sends the refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('APIFETCH: Refresh token failed with status:', response.status);
      // Clear any stored access token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
      return null;
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    if (!newAccessToken) {
      console.log('APIFETCH: No access token in refresh response');
      return null;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', newAccessToken);
    }
    return newAccessToken;
  } catch (error) {
    console.error('APIFETCH: Error refreshing token:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    return null;
  }
}

export async function apiFetch(endpoint: string, opts: ApiFetchOptions = {}): Promise<Response> {
  const {
    json,
    formData,
    timeoutMs = 20000,
    headers,
    credentials = 'include',
    skipAuth = false,
    ...rest
  } = opts;

  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(publicEndpoint =>
    endpoint.startsWith(publicEndpoint)
  );

  // Build headers
  const finalHeaders: HeadersInit = {
    'Accept': 'application/json',
    ...(formData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  // Add Authorization header for protected endpoints
  if (!isPublicEndpoint && !skipAuth && typeof window !== 'undefined') {
    let accessToken = localStorage.getItem('accessToken');

    // Check if token is expired and proactively refresh it
    if (accessToken && isTokenExpired(accessToken)) {

      // Prevent multiple concurrent refresh attempts
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (newToken) {
        accessToken = newToken;
      } else {
        console.log('APIFETCH: Proactive refresh failed for:', endpoint);
        accessToken = null;
      }
    }

    if (accessToken) {
      (finalHeaders as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const body =
    formData ? formData :
      json !== undefined ? JSON.stringify(json) :
        rest.body;

  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort('timeout'), timeoutMs) : undefined;

  try {

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...rest,
      credentials,
      cache: rest.cache ?? 'no-store',
      headers: finalHeaders,
      body,
      signal: controller.signal,
    });

    // If we get a 401 and it's not a public endpoint, try to refresh the token
    if (response.status === 401 && !isPublicEndpoint && !skipAuth) {

      // Prevent multiple concurrent refresh attempts
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (newToken) {
        // Create a new AbortController for the retry request
        const retryController = new AbortController();
        const retryTimer = timeoutMs ? setTimeout(() => retryController.abort('timeout'), timeoutMs) : undefined;

        try {
          // Retry the original request with the new token
          const retryHeaders = {
            ...finalHeaders,
            'Authorization': `Bearer ${newToken}`
          };

          const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
            ...rest,
            credentials,
            cache: rest.cache ?? 'no-store',
            headers: retryHeaders,
            body,
            signal: retryController.signal,
          });

          if (!retryResponse.ok) {
            console.log('APIFETCH: Retry failed for', endpoint, 'with status:', retryResponse.status);
          }

          return retryResponse;

        } finally {
          if (retryTimer) clearTimeout(retryTimer);
        }

      } else {

        console.log('APIFETCH: Token refresh failed for', endpoint, '- returning 401 response');
        // Token refresh failed, return the original 401 response
        return response;
      }
    }

    if (!response.ok) {
      console.log('APIFETCH: Request failed with status:', response.status);
    }

    return response;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
