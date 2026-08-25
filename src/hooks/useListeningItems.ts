import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getListeningItems,
  getListeningItemById,
  getTranscript,
  createAudioItem,
  uploadMedia,
  generateTranscript,
  type GetListeningItemsParams,
} from "@/services/listeningApi";
import { LISTENING_ITEMS_QUERY_KEY } from "@/constants/listeningQueryKeys";
import type { AxiosError } from "axios";
import type { ListeningItem } from "@/types/listening";

export function useListeningItems(params?: GetListeningItemsParams) {
  return useQuery({
    queryKey: [LISTENING_ITEMS_QUERY_KEY, params],
    queryFn: () => getListeningItems(params),
  });
}

export function useListeningItemById(id: string) {
  return useQuery<ListeningItem, AxiosError>({
    queryKey: [LISTENING_ITEMS_QUERY_KEY, id],
    queryFn: () => getListeningItemById(id),
    enabled: Boolean(id && id !== ""),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "processing") {
        return 1000;
      }
      return false;
    },
    retry: 3,
    retryDelay: (failureCount, error) => {
      const status = error.response?.status;
      if (status && status >= 500) {
        return 1000;
      }
      return Math.min(1000 * 2 ** (failureCount - 1), 30000);
    },
  });
}

export function useTranscript(id: string) {
  return useQuery({
    queryKey: [LISTENING_ITEMS_QUERY_KEY, id, "transcript"],
    queryFn: () => getTranscript(id),
    enabled: Boolean(id && id !== ""),
    retry: 3,
    retryDelay: (failureCount, error: AxiosError) => {
      const status = error?.response?.status;
      if (status && status >= 500) return 1000;
      return Math.min(1000 * 2 ** (failureCount - 1), 30000);
    },
  });
}

export function useCreateAudioItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      title,
      level,
      category,
      description,
    }: {
      title: string;
      level?: import("@/types/listening").ListeningLevel;
      category?: string;
      description?: string;
    }) => createAudioItem(title, level, category, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LISTENING_ITEMS_QUERY_KEY] });
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      file,
      onProgress,
    }: {
      id: string;
      file: File;
      onProgress?: (percent: number) => void;
    }) => uploadMedia(id, file, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LISTENING_ITEMS_QUERY_KEY] });
    },
  });
}

export function useGenerateTranscript() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => generateTranscript(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LISTENING_ITEMS_QUERY_KEY] });
    },
  });
}
