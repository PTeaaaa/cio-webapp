// src/services/apiFetch/apiFetch.ts
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
};

const API_BASE = (process.env.NEXT_PUBLIC_NESTJS_API_URL ?? '').replace(/\/+$/, '');

export async function apiFetch(endpoint: string, opts: ApiFetchOptions = {}) {
  const {
    json,
    formData,
    timeoutMs,
    headers,
    credentials = 'include',
    ...rest
  } = opts;

  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort('timeout'), timeoutMs) : undefined;

  // ไม่มีการอ่าน localStorage และไม่เติม Authorization header ใดๆ
  const finalHeaders: HeadersInit = {
    ...(formData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const body =
    formData ? formData :
    json !== undefined ? JSON.stringify(json) :
    rest.body;

  try {
    return await fetch(`${API_BASE}${endpoint}`, {
      ...rest,
      credentials,
      cache: rest.cache ?? 'no-store',
      headers: finalHeaders,
      body,
      signal: controller.signal,
    });
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// type ApiFetchOptions = Omit<RequestInit, "headers" | "credentials"> & {
//   /** If provided, auto JSON.stringify and set Content-Type */
//   json?: unknown;
//   /** If provided, use as body and DO NOT set Content-Type */
//   formData?: FormData;
//   /** Default: 'include' so cookies (refresh) flow */
//   credentials?: RequestCredentials;
//   /** Optional fetch timeout (ms) */
//   timeoutMs?: number;
//   /** Extra headers to merge */
//   headers?: HeadersInit;
// };

// const BASE = (process.env.NEXT_PUBLIC_NESTJS_API_URL ?? "").replace(/\/+$/, "");

// // Treat these endpoints as public: don't send Authorization even if a token exists
// const AUTH_PUBLIC_ENDPOINT = /^\/auth\/(login|refresh|signup|logout)(\/|$)/i;

// export async function apiFetch(endpoint: string, options: ApiFetchOptions = {}) {

//   const {
//     json,
//     formData,
//     timeoutMs = 20000,
//     headers: extraHeaders,
//     credentials,
//     method = "GET",
//     // everything else goes straight to fetch
//     ...rest
//   } = options;

//   const baseHeaders: Record<string, string> = { Accept: "application/json" };

//   // Build body carefully
//   let body: BodyInit | undefined;
//   if (formData) {
//     body = formData; // browser sets multipart boundary automatically
//   } else if (json !== undefined) {
//     baseHeaders["Content-Type"] = "application/json";
//     body = JSON.stringify(json);
//   } else if (rest.body) {
//     body = rest.body as BodyInit;
//   }

//   // Authorization header (skip for obvious public auth endpoints)
//   const shouldAttachAuth = !AUTH_PUBLIC_ENDPOINT.test(endpoint);
//   const token = shouldAttachAuth ? localStorage.getItem("accessToken") : null;
//   const authHeader = token ? ({ Authorization: `Bearer ${token}` } as Record<string, string>) : {};

//   // Merge headers
//   const headers: HeadersInit = {
//     ...baseHeaders,
//     ...authHeader,
//     ...(extraHeaders ?? {}),
//   };

//   // Timeout with AbortController
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const res = await fetch(`${BASE}${endpoint}`, {
//       method,
//       headers,
//       body,
//       credentials: credentials ?? "include", // keep cookies flowing
//       cache: rest.cache ?? "no-store",
//       signal: controller.signal,
//       ...rest,
//     });
//     return res;
//   } finally {
//     clearTimeout(id);
//   }
// }
