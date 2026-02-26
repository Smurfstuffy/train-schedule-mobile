import type { StoredSession } from '@/types/store';
import { store } from '@/store';
import { apiClient } from './axios';

export async function login(
  email: string,
  password: string,
): Promise<StoredSession> {
  const { data } = await apiClient.post<StoredSession>('/auth/login', {
    email,
    password,
  });
  return data;
}

export async function register(
  email: string,
  password: string,
): Promise<StoredSession> {
  const { data } = await apiClient.post<StoredSession>('/auth/register', {
    email,
    password,
  });
  return data;
}

export async function refresh(refreshToken: string): Promise<StoredSession> {
  const { data } = await apiClient.post<StoredSession>('/auth/refresh', {
    refreshToken,
  });
  return data;
}

export async function logout(): Promise<void> {
  const refreshToken = store.getState().auth.refreshToken;
  if (refreshToken) {
    await apiClient.post('/auth/logout', { refreshToken });
  }
}
