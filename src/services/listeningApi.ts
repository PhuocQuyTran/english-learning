import { api } from "@/api/axios";
import { audioItemEndpoints } from "@/services/endpoints";
import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from "@/services/types";
import type { ListeningLevel } from "@/types/listening";
import type { ListeningItem } from "@/types/listening";

export interface UploadMediaResponse {
  id: string;
  mediaUrl?: string | null;
  status?: "uploaded" | "processing" | "completed" | "failed";
}

export interface GetListeningItemsParams extends PaginationParams {
  search?: string;
  level?: ListeningLevel;
}

export async function getListeningItems(
  params?: GetListeningItemsParams,
): Promise<PaginatedApiResponse<ListeningItem>> {
  const { data } = await api.get<PaginatedApiResponse<ListeningItem>>(
    audioItemEndpoints.list,
    { params },
  );

  return data;
}

export async function uploadMedia(
  id: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadMediaResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ApiResponse<UploadMediaResponse>>(
    audioItemEndpoints.upload(id),
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress?.(percent);
        }
      },
    },
  );

  return data.data;
}

export async function createAudioItem(
  title: string,
  level?: ListeningLevel,
  category?: string,
  description?: string,
  durationSeconds?: number,
): Promise<ListeningItem> {
  const { data } = await api.post<ApiResponse<ListeningItem>>(
    audioItemEndpoints.create,
    {
      title,
      level: level ?? null,
      category: category ?? null,
      description,
      durationSeconds,
    },
  );
  return data.data;
}

export async function getListeningItemById(id: string): Promise<ListeningItem> {
  const { data } = await api.get<ApiResponse<ListeningItem>>(
    audioItemEndpoints.getById(id),
  );
  return data.data;
}

export async function getTranscript(id: string): Promise<any> {
  const { data } = await api.get<ApiResponse<any>>(
    audioItemEndpoints.transcript(id),
  );
  return data.data;
}

export async function generateTranscript(id: string): Promise<any> {
  const { data } = await api.post<ApiResponse<any>>(
    audioItemEndpoints.transcript(id),
  );
  return data.data;
}
