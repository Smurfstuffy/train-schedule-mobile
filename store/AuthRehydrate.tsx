import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAuthSession } from './authStorage';
import { setSession } from './slices/authSlice';

export function AuthRehydrate({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    loadAuthSession().then(session => {
      if (session) {
        dispatch(setSession(session));
      }
    });
  }, [dispatch]);

  return <>{children}</>;
}
