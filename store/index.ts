import { configureStore, type Middleware } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';

import { clearAuthSession, saveAuthSession } from './authStorage';
import authReducer, { clearSession, setSession } from './slices/authSlice';

const authStorageMiddleware: Middleware = () => next => action => {
  const result = next(action);
  if (setSession.match(action)) {
    const { accessToken, refreshToken, user } = action.payload;
    void saveAuthSession(accessToken, refreshToken, user);
  } else if (clearSession.match(action)) {
    void clearAuthSession();
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { AuthRehydrate } from './AuthRehydrate';
