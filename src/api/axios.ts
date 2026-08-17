import { ACCESS_TOKEN } from "@/constants";
import { clearUserInfo } from "@/lib/auth-storage";
import { supabase } from "@/lib/supabase";
import { clearToken, saveToken } from "@/lib/utils";
import { authEndpoints } from "@/services/endpoints";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
  _retryRefresh?: boolean;
}

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

const MAX_RETRY = 3;

const AUTH_IGNORE_URLS = [authEndpoints.login, authEndpoints.signup];

const isAuthIgnored = (url?: string) => {
  if (!url) return false;
  return AUTH_IGNORE_URLS.some((path) => url.includes(path));
};

const shouldRetry = (error: AxiosError) => {
  if (!error.response) return true;

  const status = error.response.status;
  return status === 408 || status >= 500;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Refresh the access token using Supabase client.
 * Backend doesn't have a dedicated refresh endpoint, so we use
 * Supabase's built-in session refresh and then save the new tokens.
 */
const refreshToken = async (): Promise<string> => {
  const { data, error } = await supabase.auth.refreshSession();

  if (error || !data.session) {
    throw new Error("Failed to refresh session");
  }

  const { access_token, refresh_token } = data.session;
  saveToken(access_token, refresh_token);

  return access_token;
};

// ─── Request interceptor: attach Bearer token ─────────────────────────────────

api.interceptors.request.use((config) => {
  const cookie = new Cookies();
  const token = cookie.get(ACCESS_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Fallback: check URL search params (for email confirmation redirects etc.)
  const queryToken = new URL(window.location.href)?.searchParams?.get(
    ACCESS_TOKEN,
  );

  if (!token && queryToken) {
    config.headers.Authorization = `Bearer ${queryToken}`;
  }

  return config;
});

// ─── Response interceptor: retry + token refresh ──────────────────────────────

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;
    if (!config) return Promise.reject(error);

    // Retry on network errors or 5xx
    if (!isAuthIgnored(config.url) && shouldRetry(error)) {
      config._retryCount = config._retryCount ?? 0;

      if (config._retryCount < MAX_RETRY) {
        config._retryCount++;
        await delay(1000 * config._retryCount);
        return api(config);
      }
    }

    // Handle 401 — attempt token refresh
    if (
      error.response?.status === 401 &&
      !config._retryRefresh &&
      !isAuthIgnored(config.url)
    ) {
      config._retryRefresh = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            config.headers!.Authorization = `Bearer ${token}`;
            resolve(api(config));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        config.headers!.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch {
        refreshQueue = [];
        clearToken();
        clearUserInfo();
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
