import type { SafeUser } from "@/types/auth.types";

const USER_STORAGE_KEY = "auth_user";

export function saveUserInfo(user: SafeUser): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

export function getUserInfo(): SafeUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SafeUser;
  } catch {
    return null;
  }
}

export function clearUserInfo(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch {}
}
