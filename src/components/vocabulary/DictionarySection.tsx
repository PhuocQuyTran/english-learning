import type { UseQueryResult } from "@tanstack/react-query";
import {
  DictionaryError,
  type DictionaryEntry,
} from "@/services/dictionaryApi";
import DictionaryMeaning from "./DictionaryMeaning";
import { AudioPlayer } from "./AudioPlayer";

export default function DictionarySection({
  word,
  query,
}: {
  word: string;
  query: UseQueryResult<DictionaryEntry[], Error>;
}) {
  const isLoading = query.isLoading;
  const error = query.error;
  const entries = query.data;
  const isNotFoundError =
    error instanceof DictionaryError && error.status === 404;

  if (!word) return null;

  return (
    <section className="bg-neutral p-6 rounded shadow border-border border">
      {isLoading && <p className="mt-4">Loading dictionary…</p>}

      {isNotFoundError && (
        <div className="mt-4 text-muted-foreground">
          {error.title || "No Definitions Found"} for "{word}".
        </div>
      )}

      {error && !isNotFoundError && (
        <div className="mt-4 text-red-600">
          {error instanceof DictionaryError
            ? error.message
            : "Unable to load dictionary data."}
        </div>
      )}

      {!isLoading && !error && (!entries || entries.length === 0) && (
        <div className="mt-4">No dictionary data found for "{word}".</div>
      )}

      {entries && entries.length > 0 && (
        <div className="mt-4 space-y-6">
          {entries.map((entry, ei) => (
            <div key={ei}>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xl font-bold">{entry.word}</div>
                  {entry.phonetic && (
                    <div className="text-muted-foreground">
                      {entry.phonetic}
                    </div>
                  )}
                </div>
                <div>
                  {entry.phonetics?.find((p) => p.audio) && (
                    <AudioPlayer
                      src={entry.phonetics.find((p) => p.audio)!.audio!}
                      word={entry.word}
                    />
                  )}
                </div>
              </div>
              {entry.meanings.map((m, mi) => (
                <DictionaryMeaning key={mi} meaning={m} />
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
