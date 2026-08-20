import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateVocabulary,
  useUpdateVocabulary,
} from "@/hooks/useVocabulary";
import type { Vocabulary } from "@/services/vocabularyApi";
import { Loader2 } from "lucide-react";
import {
  vocabularySchema,
  type VocabularyFormValues,
} from "@/scheme/vocabularySchema";
import { LEVEL_VALUES } from "@/constants";

interface VocabularyFormProps {
  initialData?: Vocabulary;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function VocabularyForm({
  initialData,
  onSuccess,
  onCancel,
}: VocabularyFormProps) {
  const createMutation = useCreateVocabulary();
  const updateMutation = useUpdateVocabulary();

  const isEditing = !!initialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<VocabularyFormValues>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      word: initialData?.word || "",
      meaning: initialData?.meaning || "",
      ipa: initialData?.ipa || "",
      partOfSpeech: initialData?.part_of_speech || "",
      level: initialData?.level || "",
      example: initialData?.example || "",
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  const onSubmit = (data: VocabularyFormValues) => {
    const normalizeOptional = (value?: string) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : undefined;
    };

    const normalizedLevel = normalizeOptional(data.level)?.toUpperCase();

    const payload = {
      word: data.word.trim(),
      meaning: data.meaning.trim(),

      ipa: normalizeOptional(data.ipa),
      partOfSpeech: normalizeOptional(data.partOfSpeech),
      level: normalizedLevel,
      example: normalizeOptional(data.example),
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    if (isEditing && initialData) {
      updateMutation.mutate(
        {
          id: initialData.id,
          input: payload,
        },
        {
          onSuccess: () => onSuccess?.(),
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onSuccess?.(),
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="word"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Word *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. apple" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meaning *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. quả táo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ipa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IPA</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. /ˈæp.əl/" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partOfSpeech"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Part of Speech</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. noun" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <FormControl>
                  <select
                    value={field.value || ""}
                    onChange={(event) => field.onChange(event.target.value)}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">All Levels</option>
                    {LEVEL_VALUES.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. fruit, food" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example</FormLabel>
              <FormControl>
                <Input placeholder="e.g. I ate an apple." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Add Vocabulary"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
