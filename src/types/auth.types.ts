export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  displayName: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface SessionTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number | undefined;
  token_type: string;
}

export interface SafeUser {
  id: string;
  email: string | undefined;
  role: string | undefined;
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
  };
  email_confirmed_at: string | null | undefined;
  created_at: string;
  updated_at: string;
}

export interface SignupResult {
  message: string;
  email: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  display_name?: string;
  avatar_url?: string | null;
}

export interface AuthState {
  user: SafeUser | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface AuthActions {
  setUser: (user: SafeUser | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}
