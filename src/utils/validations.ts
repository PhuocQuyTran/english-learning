import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "This field is required.")
    .pipe(z.email("Please enter a valid email address.")),
  password: z.string().min(1, "This field is required."),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "This field is required.")
    .pipe(z.email("Please enter a valid email address.")),
});

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Be at least 8 characters")
      .regex(/[A-Z]/, "Include 1 uppercase letter")
      .regex(/[a-z]/, "Include 1 lowercase letter")
      .regex(/[0-9]/, "Include at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Include at least 1 special character"),
    confirm_password: z.string().min(1, "This field is required."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "This field is required."),
    password: z
      .string()
      .min(8, "Be at least 8 characters")
      .regex(/[A-Z]/, "Include 1 uppercase letter")
      .regex(/[a-z]/, "Include 1 lowercase letter")
      .regex(/[0-9]/, "Include at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Include at least 1 special character"),
    confirm_password: z.string().min(1, "This field is required."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Be at least 2 characters")
      .max(50, "Be at most 50 characters")
      .trim(),
    email: z
      .string()
      .min(1, "This field is required.")
      .pipe(z.email("Please enter a valid email address.")),
    password: z
      .string()
      .min(8, "Be at least 8 characters")
      .regex(/[A-Z]/, "Include 1 uppercase letter")
      .regex(/[a-z]/, "Include 1 lowercase letter")
      .regex(/[0-9]/, "Include at least 1 number")
      .regex(/[^A-Za-z0-9]/, "Include at least 1 special character"),
    confirm_password: z.string().min(1, "This field is required."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type CreatePasswordFormValues = z.infer<typeof createPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
