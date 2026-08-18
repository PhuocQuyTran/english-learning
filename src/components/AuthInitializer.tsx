import { useAuthInit } from "@/hooks/useAuth";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}
