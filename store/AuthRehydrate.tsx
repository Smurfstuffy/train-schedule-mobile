import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { StoredSession } from '@/types/store';
import { API_BASE_URL } from '@/lib/config';
import { loadAuthSession } from './authStorage';
import { clearSession, setRehydrated, setSession } from './slices/authSlice';

export function AuthRehydrate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    loadAuthSession()
      .then(async stored => {
        if (stored) {
          try {
            const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken: stored.refreshToken }),
            });
            if (!res.ok) throw new Error('Refresh failed');
            const data = (await res.json()) as StoredSession;
            dispatch(setSession(data));
          } catch {
            const { clearAuthSession } = await import('./authStorage');
            await clearAuthSession();
            dispatch(clearSession());
          }
        }
      })
      .finally(() => {
        dispatch(setRehydrated());
      });
  }, [dispatch]);

  return <>{children}</>;
}
