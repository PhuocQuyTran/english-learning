import { create } from "zustand";
import type { SafeUser } from "@/types/auth.types";
import type { AuthState, AuthActions } from "@/types/auth.types";

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  user: null,
  isLoading: false,
  isInitialized: false,

  // ── Actions ────────────────────────────────────────────────────────────────
  setUser: (user: SafeUser | null) => set({ user }),

  clearAuth: () => set({ user: null }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  setInitialized: (isInitialized: boolean) => set({ isInitialized }),
}));

// ── Convenience selectors ──────────────────────────────────────────────────────

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.user !== null;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectIsInitialized = (state: AuthStore) => state.isInitialized;
