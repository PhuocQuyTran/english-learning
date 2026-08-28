import { WordTooltip } from "./WordTooltip";

interface SegmentTextProps {
  text: string;
  audioItemId: string;
  level?: string;
  savedWords?: Set<string>;
  extractedWords?: Set<string>;
}

export function SegmentText({
  text,
  audioItemId,
  level,
  savedWords = new Set(),
  extractedWords = new Set(),
}: SegmentTextProps) {
  const tokens = text.match(/[A-Za-z']+|[^A-Za-z']+/g) ?? [text];

  return (
    <span className="text-sm leading-relaxed">
      {tokens.map((token, i) => {
        const isWord = /^[A-Za-z']+$/.test(token);
        if (!isWord) return <span key={i}>{token}</span>;

        const cleanWord = token.toLowerCase().replace(/^'+|'+$/g, "");
        if (cleanWord.length < 2) return <span key={i}>{token}</span>;

        const isSaved = savedWords.has(cleanWord);
        const isExtracted = extractedWords.has(cleanWord);

        return (
          <WordTooltip
            key={i}
            word={cleanWord}
            audioItemId={audioItemId}
            level={level}
            isSaved={isSaved}
            isHighlighted={isExtracted && !isSaved}
          >
            {token}
          </WordTooltip>
        );
      })}
    </span>
  );
}
