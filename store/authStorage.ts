import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import type { AuthUser, StoredSession } from '@/types/store';

const ACCESS_TOKEN_KEY = '@train-schedule/auth/accessToken';
const USER_KEY = '@train-schedule/auth/user';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export async function saveAuthSession(
  accessToken: string,
  refreshToken: string,
  user: AuthUser,
): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}

export async function clearAuthSession(): Promise<void> {
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}

export async function loadAuthSession(): Promise<StoredSession | null> {
  const [accessToken, userJson, refreshToken] = await Promise.all([
    AsyncStorage.getItem(ACCESS_TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);

  if (!accessToken || !refreshToken || !userJson) {
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

  return { accessToken, refreshToken, user };
}
