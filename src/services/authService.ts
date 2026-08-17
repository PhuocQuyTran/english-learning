import { api } from "@/api/axios";
import { authEndpoints } from "@/services/endpoints";
import { saveToken, clearToken } from "@/lib/utils";
import { saveUserInfo, clearUserInfo } from "@/lib/auth-storage";
import type {
  LoginInput,
  RegisterInput,
  SessionTokens,
  SafeUser,
  SignupResult,
} from "@/types/auth.types";
import type { ApiResponse } from "@/services/types";

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(input: RegisterInput): Promise<SignupResult> {
  const { data: res } = await api.post<ApiResponse<SignupResult>>(
    authEndpoints.signup,
    {
      email: input.email.trim(),
      password: input.password,
      displayName: input.displayName.trim(),
    },
  );
  return res.data;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<SafeUser> {
  // 1. Get tokens from backend
  const { data: tokenRes } = await api.post<ApiResponse<SessionTokens>>(
    authEndpoints.login,
    {
      email: input.email.trim(),
      password: input.password,
    },
  );

  // 2. Save tokens to cookies
  const tokens = tokenRes.data;
  saveToken(tokens.access_token, tokens.refresh_token);

  // 3. Fetch user profile using the new token
  const user = await getCurrentUser();
  saveUserInfo(user);

  return user;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  try {
    await api.post(authEndpoints.logout);
  } finally {
    // Always clear local state, even if the server call fails
    clearToken();
    clearUserInfo();
  }
}

// ─── Get current user ─────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<SafeUser> {
  const { data: res } = await api.get<ApiResponse<SafeUser>>(authEndpoints.me);
  return res.data;
}
