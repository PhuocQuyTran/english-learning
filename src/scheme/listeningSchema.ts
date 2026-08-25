import { LEVEL_VALUES } from "@/constants";
import { z } from "zod";

export const uploadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  level: z.enum(LEVEL_VALUES, {
    message: "Please select a level (A1 – C2)",
  }),
  file: z
    .instanceof(File, { message: "Media file is required" })
    .refine((file) => file.size > 0, "Media file cannot be empty"),
});

export type UploadFormValues = z.infer<typeof uploadSchema>;
