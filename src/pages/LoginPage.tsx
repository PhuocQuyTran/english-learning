import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from "lucide-react";

import { useLoginMutation, useAuth } from "@/hooks/useAuth";
import { mapAuthError } from "@/utils/authError";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { loginSchema, type LoginFormValues } from "@/utils/validations";

export default function LoginPage() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (isInitialized && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const errorMessage = loginMutation.error
    ? mapAuthError(loginMutation.error)
    : null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <span className="text-3xl font-bold text-tertiary!">E</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">English Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personal English learning hub
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                id="login-form"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="space-y-4"
              >
                {/* Server error */}
                {errorMessage && (
                  <Alert variant="destructive" className="py-3">
                    <AlertCircle className="h-4 w-4 " />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          autoFocus
                          disabled={loginMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <button
                          type="button"
                          tabIndex={-1}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => {}}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="pr-10"
                            disabled={loginMutation.isPending}
                            {...field}
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  id="login-submit"
                  type="submit"
                  className="w-full text-tertiary"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-tertiary" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4 text-tertiary" />
                      Sign in
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-4">
              <Separator className="my-4" />
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
