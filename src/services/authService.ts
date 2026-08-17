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

export async function login(input: LoginInput): Promise<SafeUser> {
  const { data: tokenRes } = await api.post<ApiResponse<SessionTokens>>(
    authEndpoints.login,
    {
      email: input.email.trim(),
      password: input.password,
    },
  );

  const tokens = tokenRes.data;
  saveToken(tokens.access_token, tokens.refresh_token);

  const user = await getCurrentUser();
  saveUserInfo(user);

  return user;
}

export async function logout(): Promise<void> {
  try {
    await api.post(authEndpoints.logout);
  } finally {
    clearToken();
    clearUserInfo();
  }
}

export async function getCurrentUser(): Promise<SafeUser> {
  const { data: res } = await api.get<ApiResponse<SafeUser>>(authEndpoints.me);
  return res.data;
}
