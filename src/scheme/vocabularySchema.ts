import { LEVEL_VALUES } from "@/constants";
import { z } from "zod";

export const vocabularySchema = z.object({
  word: z
    .string()
    .trim()
    .min(1, "Word is required")
    .max(100, "Word must be less than 100 characters"),

  meaning: z
    .string()
    .trim()
    .min(1, "Meaning is required")
    .max(500, "Meaning must be less than 500 characters"),

  ipa: z
    .string()
    .trim()
    .max(100, "IPA must be less than 100 characters")
    .optional()
    .or(z.literal("")),

  partOfSpeech: z
    .string()
    .trim()
    .max(50, "Part of speech must be less than 50 characters")
    .optional()
    .or(z.literal("")),

  level: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        LEVEL_VALUES.includes(
          value.toUpperCase() as (typeof LEVEL_VALUES)[number],
        ),
      {
        message: "Level must be A1, A2, B1, B2, C1, or C2",
      },
    )
    .optional()
    .or(z.literal("")),

  example: z
    .string()
    .trim()
    .max(1000, "Example must be less than 1000 characters")
    .optional()
    .or(z.literal("")),

  tags: z
    .string()
    .trim()
    .max(500, "Tags must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

export type VocabularyFormValues = z.infer<typeof vocabularySchema>;
