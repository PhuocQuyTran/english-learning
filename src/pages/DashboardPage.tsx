import { useAuth, useLogoutMutation } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const logout = useLogoutMutation();
  console.log("DashboardPage rendered with user:", user);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          <p className="text-muted-foreground">
            Your role: {user?.user_metadata?.display_name}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="card shadow-sm p-6">
          <h3 className="font-semibold mb-2">Progress</h3>
          <p className="text-sm text-muted-foreground">
            Your learning progress overview will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
