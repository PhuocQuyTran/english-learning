import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "universal-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const cookies = new Cookies();

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
  secure: window.location.protocol === "https:",
};

export function saveToken(accessToken: string, refreshToken: string): void {
  const accessExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  cookies.set(ACCESS_TOKEN, accessToken, {
    ...COOKIE_OPTIONS,
    expires: accessExpiry,
  });
  cookies.set(REFRESH_TOKEN, refreshToken, {
    ...COOKIE_OPTIONS,
    expires: refreshExpiry,
  });
}

/** Remove both tokens from cookies */
export function clearToken(): void {
  cookies.remove(ACCESS_TOKEN, { path: "/" });
  cookies.remove(REFRESH_TOKEN, { path: "/" });
}

export function getAccessToken(): string | undefined {
  return cookies.get(ACCESS_TOKEN);
}

export function getRefreshToken(): string | undefined {
  return cookies.get(REFRESH_TOKEN);
}
