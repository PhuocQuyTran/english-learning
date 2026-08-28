import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as vocabularyApi from "@/services/vocabularyApi";
import type {
  VocabularyListParams,
  CreateVocabularyInput,
  UpdateVocabularyInput,
} from "@/services/vocabularyApi";
import toast from "react-hot-toast";
import {
  extractVocabularyFromTranscript,
  getDictionaryEntry,
  DictionaryError,
} from "@/services/dictionaryApi";
import type { DictionaryEntry } from "@/services/dictionaryApi";
import type { TranscriptSegment } from "@/types/listening";
import { DICTIONARY_QUERY_KEY, VOCABULARY_QUERY_KEY } from "@/constants";

export function useVocabularies(params: VocabularyListParams) {
  return useQuery({
    queryKey: [VOCABULARY_QUERY_KEY, params],
    queryFn: () => vocabularyApi.listVocabularies(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVocabularyInput) =>
      vocabularyApi.createVocabulary(input),
    onSuccess: () => {
      toast.success("Vocabulary added successfully");
      queryClient.invalidateQueries({ queryKey: [VOCABULARY_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to add vocabulary");
    },
  });
}

export function useUpdateVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVocabularyInput }) =>
      vocabularyApi.updateVocabulary(id, input),
    onSuccess: () => {
      toast.success("Vocabulary updated successfully");
      queryClient.invalidateQueries({ queryKey: [VOCABULARY_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to update vocabulary",
      );
    },
  });
}

export function useDeleteVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vocabularyApi.removeVocabulary(id),
    onSuccess: () => {
      toast.success("Vocabulary deleted successfully");
      queryClient.invalidateQueries({ queryKey: [VOCABULARY_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || "Failed to delete vocabulary",
      );
    },
  });
}

export function useVocabulary(id?: string) {
  return useQuery({
    queryKey: [VOCABULARY_QUERY_KEY, id],
    queryFn: () => vocabularyApi.getVocabularyById(id ?? ""),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}

export function useDictionary(word: string) {
  return useQuery<DictionaryEntry[], DictionaryError>({
    queryKey: [DICTIONARY_QUERY_KEY, word],

    queryFn: () => getDictionaryEntry(word),

    enabled: Boolean(word.trim()),

    staleTime: 1000 * 60 * 30,

    retry: (failureCount, error) => {
      if (error instanceof DictionaryError && error.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });
}


export function useExtractVocabulary(
  audioItemId: string,
  segments: TranscriptSegment[],
  level: string = "B1",
  enabled: boolean = false,
) {
  const fullText = segments.map((s) => s.text).join(" ");

  return useQuery({
    queryKey: ["extract-vocabulary", audioItemId],
    queryFn: () => extractVocabularyFromTranscript(fullText, level),
    enabled: enabled && !!audioItemId && segments.length > 0,
    staleTime: Infinity,
    retry: 1,
  });
}
