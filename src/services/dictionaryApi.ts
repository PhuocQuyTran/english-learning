import { api } from "@/api/axios";
import { vocabularyEndpoints } from "@/services/endpoints";

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
  vietnameseTranslation?: string;
}

export interface DictionaryApiError {
  title: string;
  message: string;
  resolution?: string;
}

export interface ExtractedWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  difficulty: "medium" | "hard";
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

const WIKTIONARY_URL = "https://en.wiktionary.org/api/rest_v1/page/definition";

// ─── Wiktionary Parser ───────────────────────────────────────────────

/** Strip lightweight HTML tags Wiktionary embeds in definition strings. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Fetch a word definition from the Wiktionary REST v1 API and normalise the
 * response into our shared `DictionaryEntry[]` shape.
 *
 * Wiktionary response shape (simplified):
 * { en: [ { partOfSpeech, language, definitions: [{ definition, parsedExamples?, synonyms? }] } ] }
 */
export async function getWiktionaryEntry(
  word: string,
): Promise<DictionaryEntry[]> {
  const normalized = (word || "").trim();
  if (!normalized) {
    throw new DictionaryError("Word is empty", { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(
      `${WIKTIONARY_URL}/${encodeURIComponent(normalized)}`,
    );
  } catch {
    throw new DictionaryError("Network error while contacting Wiktionary", {
      status: 0,
    });
  }

  if (response.status === 404) {
    throw new DictionaryError(`No Wiktionary entry found for "${normalized}"`, {
      title: "No Definition Found",
      status: 404,
    });
  }

  if (!response.ok) {
    throw new DictionaryError("Wiktionary lookup failed", {
      status: response.status,
    });
  }

  let data: Record<string, unknown[]>;
  try {
    data = await response.json();
  } catch {
    throw new DictionaryError("Unexpected Wiktionary response format", {
      status: 502,
    });
  }

  // Wiktionary sections keyed by language code, e.g. "en"
  const englishSections = (data["en"] ?? []) as Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      parsedExamples?: Array<{ example: string }>;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;

  if (englishSections.length === 0) {
    throw new DictionaryError(
      `No English definition found on Wiktionary for "${normalized}"`,
      { title: "No Definition Found", status: 404 },
    );
  }

  const meanings: DictionaryMeaning[] = englishSections.map((section) => ({
    partOfSpeech: section.partOfSpeech || "unknown",
    definitions: (section.definitions ?? []).map((def) => ({
      definition: stripHtml(def.definition),
      example: def.parsedExamples?.[0]
        ? stripHtml(def.parsedExamples[0].example)
        : undefined,
      synonyms: def.synonyms ?? [],
      antonyms: def.antonyms ?? [],
    })),
    synonyms: [],
    antonyms: [],
  }));

  const entry: DictionaryEntry = {
    word: normalized,
    // Wiktionary REST v1 does not expose IPA phonetics in this endpoint
    phonetic: undefined,
    phonetics: [],
    meanings,
    sourceUrls: [
      `https://en.wiktionary.org/wiki/${encodeURIComponent(normalized)}`,
    ],
  };

  return [entry];
}

async function getVietnameseTranslation(
  word: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        word,
      )}&langpair=en|vi`,
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    return data?.responseData?.translatedText || undefined;
  } catch {
    return undefined;
  }
}



export async function extractVocabularyFromTranscript(
  transcriptText: string,
  level: string = "B1",
): Promise<ExtractedWord[]> {
  const { data } = await api.post(vocabularyEndpoints.extract, {
    transcriptText,
    level,
  });

  return data.data;
}

export async function getDictionaryEntry(
  word: string,
): Promise<DictionaryEntry[]> {
  const normalized = (word || "").trim();

  if (!normalized) {
    throw new DictionaryError("Word is empty", { status: 400 });
  }

  // Fetch translation and wiktionary concurrently
  const translationPromise = getVietnameseTranslation(normalized);
  const wiktionaryPromise = getWiktionaryEntry(normalized);

  const [translation, entries] = await Promise.all([
    translationPromise,
    wiktionaryPromise,
  ]);

  return entries.map((entry) => ({
    ...entry,
    vietnameseTranslation: translation,
  }));
}

