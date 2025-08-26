import { apiFetch } from './apiFetch';
import { QueueItem } from '@/types';

let logoutInProgress = false;

export function setLogoutInProgress(v: boolean) {
  logoutInProgress = v;
}

// ไว้เคลียร์/ยกเลิกคำขอที่กำลังรอ retry ทั้งหมดตอน logout
export function abortAllPendingRetries(reason = 'Logout') {
  failedQueue.forEach(p => p.reject(new Error(reason)));
  failedQueue = [];
  isProcessingQueue = false;
}

// Callback function to trigger token refresh in AuthContext
type RefreshTokenCallback = (() => Promise<boolean>) | null;
let _refreshTokenCallback: RefreshTokenCallback = null;

// Queue for requests that failed due to token expiration
let failedQueue: QueueItem[] = [];
let isProcessingQueue = false; // To prevent multiple queue processing

export const setAuthRefreshCallback = (callback: RefreshTokenCallback) => {
    _refreshTokenCallback = callback;
};

export const interceptedApiFetch = async (endpoint: string, options: RequestInit = {}) => {

    console.log(`[FRONTEND] interceptedApiFetch: Calling endpoint "${endpoint}"`);

    const requestOptions = { ...options };

    try {
        let response = await apiFetch(endpoint, requestOptions);

        if (response.status === 401) {
            console.log(`[FRONTEND] interceptedApiFetch: Token expired for "${endpoint}". Status 401.`);

            if (logoutInProgress || !_refreshTokenCallback) {
                console.error("[Frontend] interceptedApiFetch: Auth refresh callback not set. Cannot refresh token.");
                abortAllPendingRetries('Logout or no refresh callback')
                throw new Error("Refresh blocked due to logout or missing callback.");
            }

            // Queue the current failed request
            const retryPromise = new Promise<Response>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            });

            // If not already refreshing, trigger the refresh via AuthContext
            if (!isProcessingQueue) {
                isProcessingQueue = true;
                console.log("[Frontend] interceptedApiFetch: Triggering token refresh via AuthContext.");
                _refreshTokenCallback().then(success => {
                    if (success) {
                        // Process the queue with the new token
                        failedQueue.forEach(prom => {
                            // Re-attempt the original request with the new token
                            apiFetch(endpoint, requestOptions)
                                .then(res => prom.resolve(res))
                                .catch(err => prom.reject(err));
                        });
                    } else {
                        // Refresh failed, reject all queued requests
                        failedQueue.forEach(prom => prom.reject(new Error("Token refresh failed.")));
                    }
                    failedQueue = [];
                    isProcessingQueue = false;
                }).catch(error => {
                    // Handle unexpected errors during refresh callback execution
                    failedQueue.forEach(prom => prom.reject(error));
                    failedQueue = [];
                    isProcessingQueue = false;
                });
            }
            return retryPromise; // Return the promise that will resolve when the queue is processed
        }
        return response;
    } catch (error) {
        console.error(`[Frontend] interceptedApiFetch: Error during request to "${endpoint}"`, error);
        throw error;
    }
};