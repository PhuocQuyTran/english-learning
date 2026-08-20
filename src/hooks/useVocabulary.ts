import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as vocabularyApi from "@/services/vocabularyApi";
import type {
  VocabularyListParams,
  CreateVocabularyInput,
  UpdateVocabularyInput,
} from "@/services/vocabularyApi";
import toast from "react-hot-toast";
import { getDictionaryEntry } from "@/services/dictionaryApi";
export const VOCABULARY_QUERY_KEY = "vocabularies";

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

export const DICTIONARY_QUERY_KEY = "dictionary";

export function useVocabulary(id?: string) {
  return useQuery({
    queryKey: [VOCABULARY_QUERY_KEY, id],
    queryFn: () => vocabularyApi.getVocabularyById(id ?? ""),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}

export function useDictionary(word: string) {
  return useQuery({
    queryKey: [DICTIONARY_QUERY_KEY, word],

    queryFn: () => getDictionaryEntry(word),

    enabled: Boolean(word.trim()),

    staleTime: 1000 * 60 * 30,

    retry: false,
  });
}
