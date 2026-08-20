import { api } from "@/api/axios";
import { vocabularyEndpoints } from "@/services/endpoints";
import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from "@/services/types";

export interface Vocabulary {
  id: string;
  user_id: string;
  word: string;
  meaning: string;
  ipa?: string;
  part_of_speech?: string;
  example?: string;
  level?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateVocabularyInput {
  word: string;
  meaning: string;
  ipa?: string;
  partOfSpeech?: string;
  example?: string;
  level?: string;
  tags?: string[];
}

export interface UpdateVocabularyInput extends Partial<CreateVocabularyInput> {}

export interface VocabularyListParams extends PaginationParams {
  keyword?: string;
  level?: string;
  partOfSpeech?: string;
  tag?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export async function listVocabularies(
  params?: VocabularyListParams,
): Promise<PaginatedApiResponse<Vocabulary>> {
  const { data } = await api.get<PaginatedApiResponse<Vocabulary>>(
    vocabularyEndpoints.list,
    { params },
  );
  return data;
}

export async function getVocabularyById(id: string): Promise<Vocabulary> {
  const { data } = await api.get<ApiResponse<Vocabulary>>(
    vocabularyEndpoints.getById(id),
  );
  return data.data;
}

export async function createVocabulary(
  input: CreateVocabularyInput,
): Promise<Vocabulary> {
  const { data } = await api.post<ApiResponse<Vocabulary>>(
    vocabularyEndpoints.create,
    input,
  );
  return data.data;
}

export async function updateVocabulary(
  id: string,
  input: UpdateVocabularyInput,
): Promise<Vocabulary> {
  const { data } = await api.patch<ApiResponse<Vocabulary>>(
    vocabularyEndpoints.update(id),
    input,
  );
  return data.data;
}

export async function removeVocabulary(id: string): Promise<void> {
  await api.delete(vocabularyEndpoints.delete(id));
}
