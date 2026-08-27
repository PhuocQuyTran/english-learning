import { WordTooltip } from "./WordTooltip";

interface SegmentTextProps {
  text: string;
}

export function SegmentText({ text }: SegmentTextProps) {
  const tokens = text.match(/[A-Za-z']+|[^A-Za-z']+/g) ?? [text];

  return (
    <span className="text-sm leading-relaxed">
      {tokens.map((token, i) => {
        const isWord = /^[A-Za-z']+$/.test(token);
        if (!isWord) {
          return <span key={i}>{token}</span>;
        }

        const cleanWord = token.toLowerCase().replace(/^'+|'+$/g, "");
        if (cleanWord.length < 2) {
          return <span key={i}>{token}</span>;
        }

        return (
          <WordTooltip key={i} word={cleanWord}>
            {token}
          </WordTooltip>
        );
      })}
    </span>
  );
}
