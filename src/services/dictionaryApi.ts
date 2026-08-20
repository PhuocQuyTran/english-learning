export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
  sourceUrls?: string[];
}

export interface DictionaryApiError {
  title: string;
  message: string;
  resolution?: string;
}

export class DictionaryError extends Error {
  title?: string;
  resolution?: string;
  status?: number;

  constructor(
    message: string,
    options?: { title?: string; resolution?: string; status?: number },
  ) {
    super(message);
    this.name = "DictionaryError";
    this.title = options?.title;
    this.resolution = options?.resolution;
    this.status = options?.status;
  }
}

const BASE_ENTRIES_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

export async function getDictionaryEntry(
  word: string,
): Promise<DictionaryEntry[]> {
  const normalized = (word || "").trim();

  if (!normalized) {
    throw new DictionaryError("Word is empty", { status: 400 });
  }

  const entriesUrl = `${BASE_ENTRIES_URL}/${encodeURIComponent(normalized)}`;
  BASE_ENTRIES_URL;
  let response: Response;
  try {
    response = await fetch(entriesUrl);
  } catch (error) {
    throw new DictionaryError(
      "Network error while contacting dictionary service",
      { status: 0 },
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new DictionaryError("Unexpected dictionary response format", {
      status: 502,
    });
  }

  // 2. Nếu API trả về lỗi (404 Not Found, 400 Bad Request, v.v.)
  if (!response.ok) {
    const errorBody = data as Partial<DictionaryApiError>;
    throw new DictionaryError(errorBody.message || "Dictionary lookup failed", {
      title: errorBody.title || "No Definition Found",
      resolution: errorBody.resolution,
      status: response.status, // Trả về đúng status gốc (VD: 404)
    });
  }

  // 3. Kiểm tra định dạng dữ liệu thành công
  if (!Array.isArray(data)) {
    throw new DictionaryError("Unexpected dictionary response format", {
      status: 502,
    });
  }

  // 4. Map dữ liệu chuẩn hóa
  return data.map((entry: any) => ({
    word: String(entry.word || normalized),
    phonetic: entry.phonetic || entry.phonetics?.[0]?.text || undefined,
    phonetics: Array.isArray(entry.phonetics)
      ? entry.phonetics.map((phone: any) => ({
          text: phone.text,
          audio: phone.audio,
          sourceUrl: phone.sourceUrl,
        }))
      : [],
    meanings: Array.isArray(entry.meanings)
      ? entry.meanings.map((meaning: any) => ({
          partOfSpeech: meaning.partOfSpeech || "",
          definitions: Array.isArray(meaning.definitions)
            ? meaning.definitions.map((def: any) => ({
                definition: def.definition || "",
                example: def.example,
                synonyms: Array.isArray(def.synonyms) ? def.synonyms : [],
                antonyms: Array.isArray(def.antonyms) ? def.antonyms : [],
              }))
            : [],
          synonyms: Array.isArray(meaning.synonyms) ? meaning.synonyms : [],
          antonyms: Array.isArray(meaning.antonyms) ? meaning.antonyms : [],
        }))
      : [],
    sourceUrls: Array.isArray(entry.sourceUrls) ? entry.sourceUrls : [],
  })) as DictionaryEntry[];
}
