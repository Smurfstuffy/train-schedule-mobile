export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}
