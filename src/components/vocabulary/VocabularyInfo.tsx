import type { Vocabulary } from "@/services/vocabularyApi";
import type { UseQueryResult } from "@tanstack/react-query";
import type { DictionaryEntry, DictionaryError } from "@/services/dictionaryApi";
import { AudioPlayer } from "./AudioPlayer";

export default function VocabularyInfo({
  vocabulary,
  dictionary,
  hidden = false,
}: {
  vocabulary: Vocabulary;
  dictionary?: UseQueryResult<DictionaryEntry[], DictionaryError>;
  hidden?: boolean;
}) {
  if (hidden) {
    return null;
  }

  const audioUrl = dictionary?.data?.[0]?.phonetics?.find(
    (p) => p.audio,
  )?.audio;

  return (
    <div className="bg-neutral p-6 rounded shadow border-border border">
      <div className="flex items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">{vocabulary.word}</h1>
          <div className="mt-2 text-sm text-muted-foreground flex items-center gap-3">
            {vocabulary.ipa && <span>{vocabulary.ipa}</span>}
            {vocabulary.level && (
              <span className="uppercase text-xs bg-blue-100 px-2 py-1 rounded">
                {vocabulary.level}
              </span>
            )}
            {vocabulary.part_of_speech && (
              <span className="italic text-sm">
                {vocabulary.part_of_speech}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AudioPlayer src={audioUrl} word={vocabulary.word} />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground">Meaning</h3>
        <p className="mt-2 text-foreground">{vocabulary.meaning}</p>
      </div>

      {vocabulary.example && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-muted-foreground">Example</h4>
          <p className="mt-2 italic">"{vocabulary.example}"</p>
        </div>
      )}

      {/* {vocabulary.tags && vocabulary.tags.length > 0 && (
        <div className="mt-4">
          <div className="flex gap-2 flex-wrap">
            {vocabulary.tags.map((t, idx) => (
              <span
                key={`${t}-${idx}`}
                className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded"
              >
                {t} 
              </span>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
}
