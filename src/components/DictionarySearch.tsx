import { useState } from "react";
import { Link } from "react-router-dom";
import { DictionaryError } from "@/services/dictionaryApi";
import { useDictionary } from "@/hooks/useVocabulary";
import { Input } from "./ui/inputs/Input";
import { AudioPlayer } from "./vocabulary/AudioPlayer";
import { Button } from "./ui/button";

export function DictionarySearch() {
  const [term, setTerm] = useState("");
  const [searchWord, setSearchWord] = useState("");

  const query = useDictionary(searchWord);
  const error = query.error;
  const isNotFoundError =
    error instanceof DictionaryError && error.status === 404;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchWord(term.trim());
  };

  return (
    <div>
      <div className="font-semibold mb-2">Look up</div>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter a word"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="mt-3">
        {query.isLoading && <div>Loading...</div>}

        {isNotFoundError && (
          <div className="text-sm text-muted-foreground">
            {error.title || "No Definitions Found"} for "{searchWord}".
          </div>
        )}

        {query.isError && !isNotFoundError && (
          <div className="text-sm text-tertiary">
            {error instanceof DictionaryError
              ? error.message
              : "Unable to load dictionary data."}
          </div>
        )}

        {query.data && query.data.length === 0 && (
          <div className="text-sm">No results</div>
        )}

        {query.data && query.data.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-auto">
            {query.data.map((entry, entryIndex) => {
              const entryKey = `${entry.word}-${entry.phonetic || entryIndex}`;

              return (
                <div key={entryKey} className="border p-2 rounded">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/vocabulary/${encodeURIComponent(entry.word)}?lookup=1`}
                      className="flex items-center gap-2"
                    >
                      <div>
                        <div className="font-semibold">{entry.word}</div>
                        {entry.phonetic && (
                          <div className="text-sm text-muted-foreground">
                            {entry.phonetic}
                          </div>
                        )}
                        {entry.vietnameseTranslation && (
                          <div className="text-muted-foreground">
                            {entry.vietnameseTranslation}
                          </div>
                        )}
                      </div>
                    </Link>
                    <div>
                      <AudioPlayer
                        src={entry.phonetics?.find((p) => p.audio)?.audio}
                        word={entry.word}
                      />
                    </div>
                  </div>

                  <div className="mt-2 space-y-1">
                    {entry.meanings?.slice(0, 2).map((meaning) => {
                      const firstDefinition =
                        meaning.definitions?.[0]?.definition;
                      if (!firstDefinition) return null;
                      const meaningKey = `${meaning.partOfSpeech}-${firstDefinition.slice(0, 15)}`;
                      return (
                        <div key={meaningKey} className="text-sm">
                          <div className="w-fit px-2 py-0.5 font-medium text-tertiary border border-muted-foreground rounded ">
                            {meaning.partOfSpeech}
                          </div>
                          <div>{firstDefinition}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
