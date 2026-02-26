import axios, { type AxiosError, isAxiosError } from 'axios';

import type { ApiErrorBody } from '@/types/api';
import type { StoredSession } from '@/types/store';
import { store } from '@/store';
import { setSession } from '@/store/slices/authSlice';
import { saveAuthSession } from '@/store/authStorage';

const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  config => {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !(originalRequest as { _retry?: boolean })._retry &&
      !isAuthEndpoint
    ) {
      (originalRequest as { _retry?: boolean })._retry = true;

      const refreshToken = store.getState().auth.refreshToken;
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          throw new Error('Refresh failed');
        }

        const data = (await res.json()) as StoredSession;
        store.dispatch(setSession(data));
        await saveAuthSession(data.refreshToken, data.user);

        const accessToken = data.accessToken;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    let body = err.response?.data as ApiErrorBody | string | undefined;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body) as ApiErrorBody;
      } catch {
        return body as string;
      }
    }
    if (typeof body !== 'object' || body === null) {
      return 'Something went wrong. Please try again.';
    }
    const msg = body?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg) && msg.length) return msg[0] ?? 'Request failed';
  }
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  return 'Something went wrong. Please try again.';
}
