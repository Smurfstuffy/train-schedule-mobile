import * as SecureStore from 'expo-secure-store';

import type { AuthUser, PersistedAuth } from '@/types/store';

const USER_KEY = 'auth_user';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export async function saveAuthSession(
  refreshToken: string,
  user: AuthUser,
): Promise<void> {
  try {
    await Promise.all([
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  } catch (e) {
    if (__DEV__) {
      console.warn('[authStorage] saveAuthSession failed:', e);
    }
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(USER_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  } catch (e) {
    if (__DEV__) {
      console.warn('[authStorage] clearAuthSession failed:', e);
    }
  }
}

export async function loadAuthSession(): Promise<PersistedAuth | null> {
  try {
    const [userJson, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(USER_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
    ]);

    if (!refreshToken || !userJson) {
      return null;
    }

    let user: AuthUser;
    try {
      user = JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }

    if (!user?.id || !user?.email || typeof user?.role !== 'string') {
      return null;
    }

    return { refreshToken, user };
  } catch {
    return null;
  }
}
