import type { AuthError } from "@supabase/supabase-js";

export function mapAuthError(error: AuthError | Error | unknown): string {
  if (!error) return "Something went wrong. Please try again.";

  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials") ||
    message.includes("wrong password") ||
    message.includes("user not found")
  ) {
    return "Email or password is incorrect.";
  }

  // Email already registered
  if (
    message.includes("user already registered") ||
    message.includes("email already") ||
    message.includes("already been registered") ||
    message.includes("already registered")
  ) {
    return "This email may already be registered. Try signing in instead.";
  }

  // Email not confirmed
  if (
    message.includes("email not confirmed") ||
    message.includes("email confirmation") ||
    message.includes("confirm your email")
  ) {
    return "Please verify your email before signing in.";
  }

  if (
    message.includes("password should be") ||
    message.includes("password must be") ||
    message.includes("at least 6") ||
    message.includes("at least 8")
  ) {
    return "Password must be at least 8 characters.";
  }

  if (message.includes("too many requests") || message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("failed to fetch") ||
    message.includes("offline")
  ) {
    return "Unable to connect. Please check your internet connection and try again.";
  }

  if (message.includes("token") && message.includes("expired")) {
    return "Your session has expired. Please sign in again.";
  }

  return "Something went wrong. Please try again.";
}
