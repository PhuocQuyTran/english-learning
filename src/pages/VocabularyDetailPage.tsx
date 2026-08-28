import { useParams, Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useVocabulary, useDictionary } from "@/hooks/useVocabulary";
import VocabularyInfo from "@/components/vocabulary/VocabularyInfo";
import DictionarySection from "@/components/vocabulary/DictionarySection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function VocabularyDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isDictionaryLookup = searchParams.get("lookup") === "1";
  const {
    data: vocab,
    isLoading,
    isError,
  } = useVocabulary(isDictionaryLookup ? undefined : id);
  const param = id ?? "";

  let displayVocab = vocab;
  if ((isDictionaryLookup || !displayVocab || isError) && param) {
    displayVocab = {
      id: param,
      user_id: "",
      word: decodeURIComponent(param),
      meaning: "",
      ipa: undefined,
      part_of_speech: undefined,
      example: undefined,
      level: undefined,
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  const word = displayVocab?.word ?? "";

  // Prevent looking up the UUID in the dictionary while the actual word is still loading
  const queryWord = (!isDictionaryLookup && isLoading) ? "" : word;
  
  const dictQuery = useDictionary(queryWord);

  const [showDictionary, setShowDictionary] = useState(isDictionaryLookup);

  if (!isDictionaryLookup && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading…</div>
    );
  }

  return (
    <div className="md:p-6">
      <div className="mb-6">
        <Link to="/vocabulary">
          <Button variant="ghost">
            <ArrowLeft className="mr-2" /> Back to Vocabulary
          </Button>
        </Link>
      </div>

      <VocabularyInfo
        vocabulary={displayVocab!}
        dictionary={dictQuery}
        hidden={isDictionaryLookup}
      />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Dictionary</h3>
          <Button size="sm" onClick={() => setShowDictionary((s) => !s)}>
            <BookOpen className="mr-2 h-4 w-4" />
            {showDictionary ? "Hide" : "Show"}
          </Button>
        </div>

        {showDictionary && <DictionarySection word={word} query={dictQuery} />}
      </div>
    </div>
  );
}
