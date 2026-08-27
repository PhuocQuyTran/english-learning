import { api } from "@/api/axios";
import { shadowingEndpoints } from "@/services/endpoints";
import type { ApiResponse } from "@/services/types";

export interface ShadowingRecording {
  id: string;
  user_id: string;
  audio_url: string;
  transcript_segment_id?: string;
  duration_ms: number;
  created_at: string;
}

export interface CreateRecordingInput {
  audioUrl: string;
  transcriptSegmentId?: string;
  durationMs: number;
}

export async function listRecordings(
  transcriptSegmentId?: string,
): Promise<ShadowingRecording[]> {
  const { data } = await api.get<ApiResponse<ShadowingRecording[]>>(
    shadowingEndpoints.list,
    { params: transcriptSegmentId ? { transcriptSegmentId } : undefined },
  );
  return data.data;
}

export async function getRecordingById(
  id: string,
): Promise<ShadowingRecording> {
  const { data } = await api.get<ApiResponse<ShadowingRecording>>(
    shadowingEndpoints.getById(id),
  );
  return data.data;
}

export async function createRecording(
  input: CreateRecordingInput,
): Promise<ShadowingRecording> {
  const { data } = await api.post<ApiResponse<ShadowingRecording>>(
    shadowingEndpoints.create,
    input,
  );
  return data.data;
}

export async function removeRecording(id: string): Promise<void> {
  await api.delete(shadowingEndpoints.remove(id));
}
