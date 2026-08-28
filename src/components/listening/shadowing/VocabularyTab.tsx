// import { useState } from "react";
// import { Search, Loader2, Plus, Volume2, Trash2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   useDictionary,
//   useVocabularies,
//   useCreateVocabulary,
//   useDeleteVocabulary,
// } from "@/hooks/useVocabulary";
// import type { DictionaryEntry } from "@/services/dictionaryApi";
// import toast from "react-hot-toast";

// interface VocabularyTabProps {
//   audioItemId: string;
// }

// export function VocabularyTab({ audioItemId }: VocabularyTabProps) {
//   const [searchWord, setSearchWord] = useState("");
//   const [debouncedWord, setDebouncedWord] = useState("");

//   const tag = `listening:${audioItemId}`;
//   const { data: savedVocabPage, isLoading: isVocabLoading } = useVocabularies({
//     tag,
//     limit: 50,
//   });

//   const savedVocab = savedVocabPage?.data || [];

//   const {
//     data: dictEntries,
//     isLoading: isSearching,
//     error: dictError,
//   } = useDictionary(debouncedWord);
//   const createMutation = useCreateVocabulary();
//   const deleteMutation = useDeleteVocabulary();

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchWord.trim()) {
//       setDebouncedWord(searchWord.trim());
//     }
//   };

//   const handleSaveWord = (entry: DictionaryEntry) => {
//     const meaning = entry.meanings[0]?.definitions[0]?.definition;
//     if (!meaning) {
//       toast.error("No definition found to save");
//       return;
//     }

//     createMutation.mutate(
//       {
//         word: entry.word,
//         ipa: entry.phonetic,
//         partOfSpeech: entry.meanings[0]?.partOfSpeech,
//         meaning: meaning,
//         example: entry.meanings[0]?.definitions[0]?.example,
//         tags: [tag],
//       },
//       {
//         onSuccess: () => {
//           setSearchWord("");
//           setDebouncedWord("");
//         },
//       },
//     );
//   };

//   const playAudio = (url?: string) => {
//     if (url) {
//       new Audio(url).play().catch(console.error);
//     }
//   };

//   return (
//     <div className="rounded-xl border border-white/10 bg-[#161B22] p-4">
//       <div className="mb-4">
//         <h2 className="text-lg font-semibold text-[#E6EDF3] mb-3">
//           Vocabulary
//         </h2>

//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
//             <Input
//               value={searchWord}
//               onChange={(e) => setSearchWord(e.target.value)}
//               placeholder="Search dictionary..."
//               className="pl-9 bg-[#0D1117] border-white/10"
//             />
//           </div>
//           <Button
//             type="submit"
//             variant="secondary"
//             className="bg-[#21262D] hover:bg-[#30363D] text-[#C9D1D9]"
//           >
//             Search
//           </Button>
//         </form>
//       </div>
//       {debouncedWord && (
//         <div className="mb-6 p-4 rounded-lg border border-[#1F6FEB]/30 bg-[#1F6FEB]/5">
//           {isSearching ? (
//             <div className="flex justify-center p-4">
//               <Loader2 className="h-5 w-5 animate-spin text-[#1F6FEB]" />
//             </div>
//           ) : dictError ? (
//             <div className="text-center text-red-400 text-sm py-2">
//               Word not found or error fetching dictionary.
//             </div>
//           ) : dictEntries && dictEntries.length > 0 ? (
//             <div>
//               <div className="flex justify-between items-start mb-2">
//                 <div>
//                   <h3 className="text-lg font-bold text-[#E6EDF3]">
//                     {dictEntries[0].word}
//                   </h3>
//                   {dictEntries[0].phonetic && (
//                     <span className="text-sm text-[#8B949E] mr-2">
//                       {dictEntries[0].phonetic}
//                     </span>
//                   )}
//                   {dictEntries[0].phonetics?.find((p) => p.audio) && (
//                     <button
//                       onClick={() =>
//                         playAudio(
//                           dictEntries[0].phonetics.find((p) => p.audio)?.audio,
//                         )
//                       }
//                       className="text-[#1F6FEB] hover:text-[#58A6FF]"
//                     >
//                       <Volume2 className="h-4 w-4 inline" />
//                     </button>
//                   )}
//                 </div>
//                 <Button
//                   size="sm"
//                   className="bg-[#238636] hover:bg-[#2EA043] h-7 px-3 text-xs"
//                   onClick={() => handleSaveWord(dictEntries[0])}
//                   disabled={createMutation.isPending}
//                 >
//                   {createMutation.isPending ? (
//                     <Loader2 className="h-3 w-3 animate-spin mr-1" />
//                   ) : (
//                     <Plus className="h-3 w-3 mr-1" />
//                   )}
//                   Save
//                 </Button>
//               </div>
//               <div className="space-y-2 mt-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
//                 {dictEntries[0].meanings.slice(0, 2).map((meaning, idx) => (
//                   <div key={idx} className="text-sm text-[#C9D1D9]">
//                     <span className="text-xs italic text-[#8B949E] mr-2">
//                       {meaning.partOfSpeech}
//                     </span>
//                     <span>{meaning.definitions[0]?.definition}</span>
//                     {meaning.definitions[0]?.example && (
//                       <div className="text-[#8B949E] italic mt-0.5 ml-4 text-xs">
//                         "{meaning.definitions[0].example}"
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//         </div>
//       )}

//       {/* Saved Vocabulary List */}
//       <div>
//         <h3 className="text-sm font-medium text-[#8B949E] mb-3">
//           Saved for this item
//         </h3>

//         {isVocabLoading ? (
//           <div className="flex justify-center p-4">
//             <Loader2 className="h-4 w-4 animate-spin text-[#8B949E]" />
//           </div>
//         ) : savedVocab.length === 0 ? (
//           <div className="text-center p-6 bg-[#0D1117] rounded-lg border border-white/5 border-dashed text-sm text-[#8B949E]">
//             No vocabulary saved yet.
//           </div>
//         ) : (
//           <div className="space-y-2">
//             {savedVocab.map((vocab) => (
//               <div
//                 key={vocab.id}
//                 className="p-3 bg-[#0D1117] rounded-lg border border-white/5"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-baseline">
//                     <span className="font-semibold text-[#E6EDF3]">
//                       {vocab.word}
//                     </span>
//                     {vocab.part_of_speech && (
//                       <span className="text-xs italic text-[#8B949E] ml-2">
//                         {vocab.part_of_speech}
//                       </span>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => {
//                       if (window.confirm("Delete this saved word?")) {
//                         deleteMutation.mutate(vocab.id);
//                       }
//                     }}
//                     disabled={deleteMutation.isPending}
//                     className="text-[#8B949E] hover:text-red-400 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     title="Delete vocabulary"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//                 {vocab.ipa && (
//                   <div className="text-xs text-[#8B949E] mb-1">{vocab.ipa}</div>
//                 )}
//                 <div className="text-sm text-[#C9D1D9]">{vocab.meaning}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useMemo } from "react";
import {
  Search,
  Loader2,
  Plus,
  Volume2,
  Trash2,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useDictionary,
  useVocabularies,
  useCreateVocabulary,
  useDeleteVocabulary,
} from "@/hooks/useVocabulary";
import { useExtractVocabulary } from "@/hooks/useVocabulary";
import type { DictionaryEntry, ExtractedWord } from "@/services/dictionaryApi";
import type { TranscriptSegment } from "@/types/listening";

import toast from "react-hot-toast";
import type { ExtractedWordCardProps } from "@/types/dictonaryTypes";

interface VocabularyTabProps {
  audioItemId: string;
  segments: TranscriptSegment[]; // transcript segments for AI extraction
  level?: string; // audio item level (A1–C2) for better AI prompt
}

export function VocabularyTab({
  audioItemId,
  segments,
  level = "B1",
}: VocabularyTabProps) {
  const [searchWord, setSearchWord] = useState("");
  const [debouncedWord, setDebouncedWord] = useState("");
  const [extractEnabled, setExtractEnabled] = useState(false);
  const [showExtracted, setShowExtracted] = useState(true);

  const tag = `listening:${audioItemId}`;

  const { data: savedVocabPage, isLoading: isVocabLoading } = useVocabularies({
    tag,
    limit: 50,
  });
  const savedVocab = savedVocabPage?.data ?? [];
  const savedWordSet = useMemo(
    () => new Set(savedVocab.map((v) => v.word.toLowerCase())),
    [savedVocab],
  );

  const {
    data: extractedWords,
    isLoading: isExtracting,
    isError: isExtractError,
  } = useExtractVocabulary(audioItemId, segments, level, extractEnabled);
  const {
    data: dictEntries,
    isLoading: isSearching,
    error: dictError,
  } = useDictionary(debouncedWord);

  const createMutation = useCreateVocabulary();
  const deleteMutation = useDeleteVocabulary();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchWord.trim()) setDebouncedWord(searchWord.trim());
  };

  const handleSaveWord = (entry: DictionaryEntry, overrideMeaning?: string) => {
    const meaning =
      overrideMeaning ?? entry.meanings[0]?.definitions[0]?.definition;
    if (!meaning) {
      toast.error("No definition found to save");
      return;
    }

    createMutation.mutate(
      {
        word: entry.word,
        ipa: entry.phonetic,
        partOfSpeech: entry.meanings[0]?.partOfSpeech,
        meaning,
        example: entry.meanings[0]?.definitions[0]?.example,
        tags: [tag],
      },
      {
        onSuccess: () => {
          setSearchWord("");
          setDebouncedWord("");
          toast.success(`"${entry.word}" saved`);
        },
      },
    );
  };

  const handleSaveExtracted = (w: ExtractedWord) => {
    if (savedWordSet.has(w.word.toLowerCase())) {
      toast("Already saved", { icon: "ℹ️" });
      return;
    }
    createMutation.mutate(
      {
        word: w.word,
        ipa: w.phonetic,
        partOfSpeech: w.partOfSpeech,
        meaning: w.meaning,
        example: w.example,
        tags: [tag],
      },
      { onSuccess: () => toast.success(`"${w.word}" saved`) },
    );
  };

  const handleSaveAll = () => {
    if (!extractedWords?.length) return;
    const unsaved = extractedWords.filter(
      (w) => !savedWordSet.has(w.word.toLowerCase()),
    );
    if (unsaved.length === 0) {
      toast("All words already saved", { icon: "ℹ️" });
      return;
    }
    unsaved.forEach((w) =>
      createMutation.mutate({
        word: w.word,
        ipa: w.phonetic,
        partOfSpeech: w.partOfSpeech,
        meaning: w.meaning,
        example: w.example,
        tags: [tag],
      }),
    );
    toast.success(`Saved ${unsaved.length} words`);
  };

  const playAudio = (url?: string) => {
    if (url) new Audio(url).play().catch(console.error);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#161B22] p-4 space-y-5">
      <div className="rounded-lg border border-white/10 bg-[#0D1117] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-medium text-[#E6EDF3]">
              Key vocabulary
            </h3>
            {extractedWords && (
              <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                {extractedWords.length} words
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {extractedWords && (
              <button
                onClick={() => setShowExtracted((p) => !p)}
                className="text-[#8B949E] hover:text-[#E6EDF3]"
              >
                {showExtracted ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}

            {!extractedWords && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExtractEnabled(true)}
                disabled={isExtracting || segments.length === 0}
                className="h-7 gap-1.5 border-amber-400/30 text-amber-400 hover:border-amber-400 hover:bg-amber-400/10 text-xs"
              >
                {isExtracting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {isExtracting ? "Analyzing..." : "Auto-extract"}
              </Button>
            )}

            {extractedWords && extractedWords.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveAll}
                disabled={createMutation.isPending}
                className="h-7 gap-1.5 border-white/10 text-[#8B949E] hover:border-[#3FB950] hover:text-[#3FB950] text-xs"
              >
                <Plus className="h-3 w-3" />
                Save all
              </Button>
            )}
          </div>
        </div>
        {!extractEnabled && !extractedWords && (
          <p className="text-xs text-[#8B949E]">
            Click "Auto-extract" to let AI find important vocabulary from this
            transcript.
          </p>
        )}

        {isExtracting && (
          <div className="flex items-center gap-2 py-3 text-sm text-[#8B949E]">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            Analyzing transcript...
          </div>
        )}
        {isExtractError && (
          <p className="text-xs text-red-400">
            Failed to analyze. Check connection and try again.
          </p>
        )}

        {extractedWords && showExtracted && (
          <div className="space-y-2">
            {extractedWords.map((w) => {
              const alreadySaved = savedWordSet.has(w.word.toLowerCase());
              return (
                <ExtractedWordCard
                  key={w.word}
                  word={w}
                  isSaved={alreadySaved}
                  isSaving={createMutation.isPending}
                  onSave={() => handleSaveExtracted(w)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-[#E6EDF3] mb-3 flex items-center gap-2">
          <Search className="h-4 w-4 text-[#8B949E]" />
          Dictionary search
        </h2>

        <form onSubmit={handleSearch} className="flex gap-2 mb-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
            <Input
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              placeholder="Search a word..."
              className="pl-9 bg-[#0D1117] border-white/10 text-sm"
            />
          </div>
          <Button type="submit" variant="success" size="lg">
            Search
          </Button>
        </form>

        {debouncedWord && (
          <div className="rounded-lg border border-[#1F6FEB]/30 bg-[#1F6FEB]/5 p-4">
            {isSearching ? (
              <div className="flex justify-center p-3">
                <Loader2 className="h-5 w-5 animate-spin text-[#1F6FEB]" />
              </div>
            ) : dictError ? (
              <p className="text-center text-red-400 text-sm py-2">
                Word not found.
              </p>
            ) : dictEntries && dictEntries.length > 0 ? (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-base font-bold text-[#E6EDF3]">
                        {dictEntries[0].word}
                      </h3>
                      {dictEntries[0].phonetic && (
                        <span className="text-sm text-[#8B949E]">
                          {dictEntries[0].phonetic}
                        </span>
                      )}
                      {dictEntries[0].phonetics?.find((p) => p.audio) && (
                        <Button
                          onClick={() =>
                            playAudio(
                              dictEntries[0].phonetics.find((p) => p.audio)
                                ?.audio,
                            )
                          }
                          className="text-[#1F6FEB] hover:text-[#58A6FF]"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveWord(dictEntries[0])}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                  {dictEntries[0].meanings.slice(0, 2).map((meaning, idx) => (
                    <div key={idx} className="text-sm text-[#C9D1D9]">
                      <span className="text-xs italic text-[#8B949E] mr-2">
                        {meaning.partOfSpeech}
                      </span>
                      <span>{meaning.definitions[0]?.definition}</span>
                      {meaning.definitions[0]?.example && (
                        <div className="text-[#8B949E] italic mt-0.5 ml-3 text-xs">
                          "{meaning.definitions[0].example}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-[#8B949E] mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Saved ({savedVocab.length})
        </h3>

        {isVocabLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-[#8B949E]" />
          </div>
        ) : savedVocab.length === 0 ? (
          <div className="text-center p-5 bg-[#0D1117] rounded-lg border border-dashed border-white/10 text-sm text-[#8B949E]">
            No vocabulary saved yet.
          </div>
        ) : (
          <div className="space-y-2">
            {savedVocab.map((vocab) => (
              <div
                key={vocab.id}
                className="p-3 bg-[#0D1117] rounded-lg border border-white/5 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[#E6EDF3]">
                      {vocab.word}
                    </span>
                    {vocab.part_of_speech && (
                      <span className="text-xs italic text-[#8B949E]">
                        {vocab.part_of_speech}
                      </span>
                    )}
                    {vocab.ipa && (
                      <span className="text-xs text-[#8B949E]">
                        {vocab.ipa}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm(`Delete "${vocab.word}"?`)) {
                        deleteMutation.mutate(vocab.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    className="opacity-0 group-hover:opacity-100 text-[#8B949E] hover:text-red-400 p-1 rounded transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="text-sm text-[#C9D1D9] mt-1">
                  {vocab.meaning}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExtractedWordCard({
  word,
  isSaved,
  isSaving,
  onSave,
}: ExtractedWordCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        isSaved
          ? "border-[#3FB950]/20 bg-[#3FB950]/5"
          : "border-white/10 bg-[#161B22]",
        word.difficulty === "hard" && !isSaved && "border-amber-400/20",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex-1 cursor-pointer"
          onClick={() => setExpanded((p) => !p)}
        >
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-medium text-[#E6EDF3]">{word.word}</span>
            <span className="text-[10px] italic text-[#8B949E]">
              {word.partOfSpeech}
            </span>
            {word.phonetic && (
              <span className="text-[10px] text-[#8B949E]">
                {word.phonetic}
              </span>
            )}
            {word.difficulty === "hard" && (
              <span className="rounded bg-amber-400/10 px-1 py-0.5 text-[9px] font-medium text-amber-400">
                hard
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-[#C9D1D9]">{word.meaning}</p>
        </div>

        <Button
          onClick={onSave}
          disabled={isSaved || isSaving}
          className={cn(
            "shrink-0 flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors",
            isSaved
              ? "border-[#3FB950]/30 text-[#3FB950] cursor-default"
              : "border-white/10 text-[#8B949E] hover:border-[#3FB950] hover:text-[#3FB950]",
          )}
        >
          {isSaving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isSaved ? (
            "Saved ✓"
          ) : (
            <>
              <Plus className="h-3 w-3" />
              Save
            </>
          )}
        </Button>
      </div>
      {expanded && word.example && (
        <p className="mt-2 text-[11px] italic text-[#8B949E] border-l-2 border-white/10 pl-2">
          "{word.example}"
        </p>
      )}
    </div>
  );
}
