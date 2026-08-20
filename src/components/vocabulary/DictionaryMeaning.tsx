import type { DictionaryMeaning } from "@/services/dictionaryApi";

export default function DictionaryMeaning({
  meaning,
}: {
  meaning: DictionaryMeaning;
}) {
  return (
    <div className="mt-4 font-mono text-[#E6EDF3]">
      <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[#161B22] border border-[#8B949E] text-[#3FB950] capitalize">
        {meaning.partOfSpeech}
      </span>

      <div className="mt-3 space-y-4">
        {meaning.definitions.map((def, idx) => {
          const itemKey = `${meaning.partOfSpeech}-${def.definition.slice(0, 15)}-${idx}`;

          return (
            <div key={itemKey} className="pl-2 border-l-2 border-[#8B949E]/30">
              <div className="text-[0.95rem]">
                <span className="text-[#3FB950] font-bold mr-2">
                  {idx + 1}.
                </span>
                {def.definition}
              </div>

              {def.example && (
                <div className="text-sm text-[#8B949E] italic mt-1 pl-4">
                  "{def.example}"
                </div>
              )}

              {def.synonyms && def.synonyms.length > 0 && (
                <div className="mt-1.5 text-xs text-[#8B949E] pl-4">
                  <span className="text-[#3FB950]">Synonyms:</span>{" "}
                  {def.synonyms.join(", ")}
                </div>
              )}

              {def.antonyms && def.antonyms.length > 0 && (
                <div className="mt-1.5 text-xs text-[#8B949E] pl-4">
                  <span className="text-[#F85149]">Antonyms:</span>{" "}
                  {def.antonyms.join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
