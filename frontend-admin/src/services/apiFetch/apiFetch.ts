export type ApiFetchOptions = Omit<RequestInit, 'headers' | 'credentials'> & {
  json?: unknown; // จะถูก JSON.stringify และตั้ง Content-Type เป็น application/json
  formData?: FormData; // ถ้าเป็น FormData จะไม่ตั้ง Content-Type
  timeoutMs?: number; // ตั้ง timeout (ms) ได้
  headers?: HeadersInit; // เฮดเดอร์เพิ่มเอง
  credentials?: RequestCredentials; // ค่าเริ่มต้นคือ include
  skipAuth?: boolean; // Skip automatic JWT token attachment for public endpoints
};

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_API_URL ?? 'http://localhost:3003').replace(/\/+$/, '');

// Endpoints that don't need authentication
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/refresh-token'];

// Token refresh state to prevent multiple concurrent refresh requests
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  try {
    console.log('🔄 APIFETCH: Attempting to refresh access token via cookies...');
    const response = await fetch(`${API_BASE}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include', // This sends the refresh token cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('🚫 APIFETCH: Refresh token failed with status:', response.status);
      return false;
    }

    console.log('✅ APIFETCH: Access token refreshed successfully and set in cookie');
    return true;
  } catch (error) {
    console.error('🚫 APIFETCH: Error refreshing token:', error);
    return false;
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

  // Note: No need to add Authorization header - access token is in HTTP-only cookie

  const body =
    formData ? formData :
      json !== undefined ? JSON.stringify(json) :
        rest.body;

  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort('timeout'), timeoutMs) : undefined;

  try {
    console.log('🌐 APIFETCH: Making request to:', endpoint);

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
      console.log('🔄 APIFETCH: Got 401 for', endpoint, '- attempting to refresh access token...');

      // Prevent multiple concurrent refresh attempts
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const refreshSuccess = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (refreshSuccess) {
        // Create a new AbortController for the retry request
        const retryController = new AbortController();
        const retryTimer = timeoutMs ? setTimeout(() => retryController.abort('timeout'), timeoutMs) : undefined;

        try {
          console.log('🔄 APIFETCH: Retrying request to', endpoint, 'with refreshed cookie...');

          const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
            ...rest,
            credentials,
            cache: rest.cache ?? 'no-store',
            headers: finalHeaders,
            body,
            signal: retryController.signal,
          });

          if (retryResponse.ok) {
            console.log('✅ APIFETCH: Retry successful for', endpoint);
          } else {
            console.log('🚫 APIFETCH: Retry failed for', endpoint, 'with status:', retryResponse.status);
          }

          return retryResponse;
        } finally {
          if (retryTimer) clearTimeout(retryTimer);
        }
      } else {
        console.log('🚫 APIFETCH: Token refresh failed for', endpoint, '- returning 401 response');
        // Token refresh failed, return the original 401 response
        return response;
      }
    }

    if (response.ok) {
      console.log('✅ APIFETCH: Request successful');
    } else {
      console.log('🚫 APIFETCH: Request failed with status:', response.status);
    }

    return response;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
