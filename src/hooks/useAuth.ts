import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import * as authService from "@/services/authService";
import { getUserInfo } from "@/lib/auth-storage";
import { getAccessToken } from "@/lib/utils";
import {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialized,
} from "@/store/useAuthStore";
import { mapAuthError } from "@/utils/authError";
import type { LoginInput, RegisterInput } from "@/types/auth.types";

export function useAuthInit() {
  const { setUser, clearAuth, setInitialized, setLoading } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      setLoading(true);

      try {
        const token = getAccessToken();

        if (!token) {
          clearAuth();
          return;
        }
        const cachedUser = getUserInfo();
        if (cachedUser && mounted) {
          setUser(cachedUser);
        }

        const user = await authService.getCurrentUser();
        if (mounted) {
          setUser(user);
        }
      } catch {
        if (mounted) {
          clearAuth();
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, [setUser, clearAuth, setInitialized, setLoading]);
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    onSuccess: (user) => {
      setUser(user);
      void navigate("/dashboard", { replace: true });
    },
    onError: (error: unknown) => {
      throw new Error(mapAuthError(error));
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    onError: (error: unknown) => {
      throw new Error(mapAuthError(error));
    },
  });
}

export function useLogoutMutation() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      void navigate("/login", { replace: true });
    },
    onError: (error: unknown) => {
      throw new Error(mapAuthError(error));
    },
  });
}

export const useAuth = () => ({
  user: useAuthStore(selectUser),
  isAuthenticated: useAuthStore(selectIsAuthenticated),
  isLoading: useAuthStore(selectIsLoading),
  isInitialized: useAuthStore(selectIsInitialized),
});
