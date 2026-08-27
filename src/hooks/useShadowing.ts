import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as shadowingApi from "@/services/shadowingApi";
import type { CreateRecordingInput } from "@/services/shadowingApi";
import toast from "react-hot-toast";
import { getDictionaryEntry } from "@/services/dictionaryApi";
import { SHADOWING_RECORDINGS_QUERY_KEY } from "@/constants";
interface WordTranslation {
  word: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: string;
}

export function useRecordings(transcriptSegmentId?: string) {
  return useQuery({
    queryKey: [SHADOWING_RECORDINGS_QUERY_KEY, transcriptSegmentId],
    queryFn: () => shadowingApi.listRecordings(transcriptSegmentId),
    enabled: true,
  });
}

export function useCreateRecording() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecordingInput) =>
      shadowingApi.createRecording(input),
    onSuccess: () => {
      toast.success("Recording saved successfully");
      queryClient.invalidateQueries({
        queryKey: [SHADOWING_RECORDINGS_QUERY_KEY],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to save recording");
    },
  });
}

export function useDeleteRecording() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shadowingApi.removeRecording(id),
    onSuccess: () => {
      toast.success("Recording deleted");
      queryClient.invalidateQueries({
        queryKey: [SHADOWING_RECORDINGS_QUERY_KEY],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || "Failed to delete recording");
    },
  });
}

async function fetchWordTranslation(word: string): Promise<WordTranslation> {
  const clean = word.toLowerCase().replace(/[^a-z'-]/g, "");

  try {
    const entries = await getDictionaryEntry(clean);
    if (!entries || entries.length === 0) {
      throw new Error("No definition found");
    }

    const entry = entries[0];
    const meaning = entry.meanings?.[0];
    const definition =
      meaning?.definitions?.[0]?.definition || "No definition available";

    return {
      word: entry.word,
      translation: definition,
      phonetic: entry.phonetic || "",
      partOfSpeech: meaning?.partOfSpeech || "",
    };
  } catch (error) {
    throw error;
  }
}
export function useWordTranslation(word: string | null) {
  return useQuery({
    queryKey: ["word-translation", word?.toLowerCase()],
    queryFn: () => fetchWordTranslation(word!),
    enabled: !!word && word.length > 1,
    staleTime: Infinity,
    retry: 2,
  });
}
