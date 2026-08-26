import React, { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Loader2 } from "lucide-react";
import { useWordTranslation } from "@/hooks/useShadowing";

interface WordTooltipProps {
  word: string;
  children: React.ReactNode;
}

export function WordTooltip({ word, children }: WordTooltipProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useWordTranslation(open ? word : null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>
          <span
            role="button"
            tabIndex={-1}
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }
            }}
            className="cursor-pointer rounded-sm px-0.5 transition-colors
              hover:bg-white/10 hover:text-[#E6EDF3]
              aria-expanded:bg-[#3FB950]/15 aria-expanded:text-[#3FB950]"
            aria-expanded={open}
          >
            {children}
          </span>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={6}
            collisionPadding={12}
            onClick={(e) => e.stopPropagation()}
            className="z-50 min-w-[120px] max-w-[220px] rounded-xl border border-white/10
              bg-[#161B22] px-3 py-2.5 shadow-2xl
              data-[state=delayed-open]:animate-in data-[state=closed]:animate-out
              data-[state=closed]:fade-out-0 data-[state=delayed-open]:fade-in-0
              data-[state=closed]:zoom-out-95 data-[state=delayed-open]:zoom-in-95"
          >
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                <Loader2 className="h-3 w-3 animate-spin" />
                Translating...
              </div>
            )}

            {isError && (
              <p className="text-xs text-red-400">No translation found</p>
            )}

            {data && !isLoading && (
              <div className="space-y-1">
                {(data.partOfSpeech || data.phonetic) && (
                  <div className="flex items-baseline gap-1.5">
                    {data.partOfSpeech && (
                      <span className="text-[10px] font-medium italic text-[#8B949E]">
                        {data.partOfSpeech}
                      </span>
                    )}
                    {data.phonetic && (
                      <span className="text-[10px] text-[#8B949E]">
                        {data.phonetic}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[13px] font-medium leading-snug text-[#E6EDF3]">
                  {data.translation}
                </p>
              </div>
            )}

            <Tooltip.Arrow className="fill-[#161B22]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
